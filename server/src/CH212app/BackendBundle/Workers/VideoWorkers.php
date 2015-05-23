<?php
namespace CH212app\BackendBundle\Workers;

use Doctrine\ORM\EntityManager;
use Mmoreram\GearmanBundle\Driver\Gearman;
use Symfony\Component\Filesystem\Filesystem as Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface as Container;
/**
 * @Gearman\Work(
 *     iterations    = 0,
 *     description   = "Alesso video reward and preview workers",
 *     defaultMethod = "doBackground",
 *     service       = "ch212app.alesso.video_worker"
 * )
 */

class VideoWorkers
{
	//DEBEMOS PARAMETRIZAR POR ENTORNO
    //const video_scripts_path = "/var/www/vhosts/212vip.linkemann.net/httpdocs/";
    //const web_folder         = "/var/www/vhosts/dev.linkemann.net/httpdocs/212vip/server/web/";
    const video_ready_dir    	 	= "VRReadyFolder/";
    const video_pending_dir  		= "VRPendingFolder/";
    const script_name_video_preview = "VRpreview.sh";

    /**
     * @var Container
     */
    private $container;

    /**
     * @var String
     */
    private $scripts_path;

    /**
     * @var String
     */
    private $web_path;

    /**
     * @var String
     */
    private $config_path;

    /**
     *
     * @var String
     */
    private $previews_path;

    /**
     * @var String
     */
    private $render_path;

    /**
	 * @var EntityManager
	 */
	protected $em;

    /**
     * Constructor with dependecy injections
     *
     * @param Container $container
     * @param string $scripts_path
     * @param string $web_path
     */
    public function __construct(Container $container, $scripts_path, $web_path, $config_path, EntityManager $em)
    {
    	$this->container    = $container;
    	$this->scripts_path = $scripts_path;
    	$this->web_path     = $web_path;
    	$this->config_path  = $config_path;
        //$this->preview_path = $this->web_path.'videos/previews/';
        //$this->render_path = $this->web_path.'videos/render/';
		$this->preview_path = $this->web_path.'uploads/documents/previews/';
		$this->render_path  = $this->web_path.'uploads/documents/render/';
		$this->em	    	= $em;

    	echo "Constructing job\r\n";
    	echo "* Web Path ".$this->web_path."\r\n";
        echo "* Config path ".$this->config_path."\n\n";

		try{
	            $fs = new Filesystem();
	    	    if(!$fs->exists($this->preview_path)) $fs->mkdir($this->preview_path);
	    	    if(!$fs->exists($this->render_path))  $fs->mkdir($this->render_path);
		}
		catch(\Exception $e)
		{
		    echo "Error on filesystem\r\n";
		}
    }

    /**
     * @Gearman\Job(
     *     iterations  = 0,
     *     name        = "Preview_generator",
     *     description = "This job is for generate previews from a video"
     * )
     */
    public function generatePreview(\GearmanJob $job)
    {
        $logger = $this->container->get('logger');

        $job_id = uniqid();

        $logger->info("WORKER $job_id *** Generating a preview... ***");
        $logger->info("WORKER $job_id *** START PREVIEW ***");

        $data = json_decode($job->workload(), true);

        //get the args for the job
        $filtro              = $data['filtro'];
		$video_id	     	 = $data['video_id'];
        $video_full_path     = $this->web_path.$data['video_path'];
        $video_name          = basename($video_full_path);
        $video_relative_path = self::video_pending_dir . $video_name;
        $video_path          = $this->scripts_path . $video_relative_path;

        $logger->info("WORKER $job_id Configuration video");
        $logger->info("WORKER $job_id Filtro: $filtro");
        $logger->info("WORKER $job_id Video a procesar: $video_name");
        $logger->info("WORKER $job_id El path del fichero es: $video_full_path");

        try {
            # copy video to relative process dir
            $fs = new Filesystem();

            if(!$fs->exists($video_full_path))
            {
                $logger->error("WORKER $job_id preview: File not found!: $video_full_path");
	        	return False;
	    	}


            $logger->info("WORKER $job_id Trying to copy $video_full_path to $video_path");
            $fs->copy($video_full_path, $video_path);

            $video_script_path = $this->scripts_path . self::script_name_video_preview;

            $exec_command = $video_script_path . ' ' . $video_relative_path . ' ' . $filtro . ' ' . $this->config_path;
            $logger->info("WORKER $job_id EXEC COMMAND: $exec_command");
            $this->em->getConnection()->close();
            exec($exec_command);

            //check if the file preview was created and move it to the new location
            $preview_name = "preview_" . $filtro . '_' . substr($video_name, 0, -4) . ".png";
            $path_preview_image = $this->scripts_path . self::video_ready_dir . $preview_name;
            $logger->info("WORKER $job_id Looking for generated preview: $path_preview_image");

            if($fs->exists($path_preview_image)) {

            	//Copying file to folder
            	$targetFile = $this->preview_path.$preview_name;
                $logger->info("WORKER $job_id File found!! .Copying to: $targetFile");
                $fs->copy($path_preview_image, $targetFile);

                //Settgin video entity
                $video= $this->em->getRepository('BackendBundle:Video')->findOneBy(array('id' => $video_id));
                switch($filtro)
                {
                	case "italiano":
                		$video->setPreviewItaliano($targetFile);
                		break;
                	case "waldengrid":
                		$video->setPreviewWaldengrid($targetFile);
                		break;
                	case "lightleaks":
                		$video->setPreviewLightleaks($targetFile);
                		break;
                	default:
                		echo "Error";
                		break;
                }
                $this->em->flush();
            }
        } catch (Exception $e) {
            switch($filtro)
            {
                case "italiano":
                    $video->setPreviewItaliano("ERROR: $exec_command");
                    break;
                case "waldengrid":
                    $video->setPreviewWaldengrid("ERROR: $exec_command");
                    break;
                case "lightleaks":
                    $video->setPreviewLightleaks("ERROR: $exec_command");
                    break;
                default:
                    echo "Error";
                    break;
            }

            $logger->error("WORKER $job_id ERROR: video: $video_path command: $exec_command Exception: $exception");
            return False;
        }

        $logger->info("WORKER $job_id *** Finishing preview ... ***");
        $logger->info("WORKER $job_id *** END PREVIEW ***");
        return true;
    }

    /**
     * @Gearman\Job(
     *     iterations  = 0,
     *     name        = "Render-video",
     *     description = "This job is for generate previews from a video"
     * )
     */
    public function processVideo(\GearmanJob $job)
    {
        $logger = $this->container->get('logger');

        $job_id = uniqid();

        $logger->info("WORKER RENDER $job_id *** Generating process ... ***");

        //get the args for the job
        $data = json_decode($job->workload(), true);
        $filtro          = $data['filtro'];
        $video_id = $data['video_id'];
        $video_header    = $data['header'];

        try {
            # get the video from db using video_id
            $video = $this->em->getRepository('BackendBundle:Video')->findOneBy(array('id' => $video_id));
            $video_to_process = $video->getAbsolutePath();
            $full_path_video = $this->web_path.$video_to_process;
            $video_name      = basename($video_to_process);

            $user = $video->getUser();
            $user_name  = $user->getName() == '' ? 'Unknow' : $user->getName();
        

			/**
			 * 1 - Copiar el video a donde toca
			 * 2 - Ejecutar el comando
			 * 3 - Esperar a que acabe
			 * 4 - �Que hacemos con el video?
			 */
            $logger->info("WORKER RENDER $job_id Configuration video");
            $logger->info("WORKER RENDER $job_id Filtro: $filtro");
            $logger->info("WORKER RENDER $job_id Video a procesar: $video_to_process");
            $logger->info("WORKER RENDER $job_id User name: $user_name");
            $logger->info("WORKER RENDER $job_id Header: $video_header");
            $logger->info("WORKER RENDER $job_id El path del fichero es: $full_path_video");
        
	        $fs = new Filesystem();

	        if(!$fs->exists($full_path_video))
	        {
                $logger->error("WORKER RENDER $job_id File not found!");
	        	return False;
	        }

            $pending_relative_path_file = self::video_pending_dir . $video_name;
			$logger->info("WORKER RENDER $job_id Trying to copy file: $full_path_video");
	        $fs->copy($full_path_video, $this->scripts_path.$pending_relative_path_file);
			$logger->info("WORKER RENDER $job_id Trying to destine: $this->scripts_path.$pending_relative_path_file");

	        //We must build:/var/www/vhosts/212vip.linkemann.net/httpdocs/VR1.sh VRPendingFolder/5955780f72724adaf6738986517542cb2ddd0aae-N.mp4 Nahuel italiano header_a /var/www/vhosts/212vip.linkemann.net/httpdocs/config.sh
	        $buildCommand = $this->scripts_path.'VReward.sh '.$pending_relative_path_file.' '.$user_name.' '.$filtro.' '.$video_header.' '.$this->config_path;
            $logger->info("WORKER RENDER $job_id Trying to execute this command: $buildCommand");
            $this->em->getConnection()->close();
	        exec($buildCommand);


            //check if the file render was created and move it to the new location
            $rendered_name = "complete_" . $filtro . '_' . substr($video_name, 0, -4) . ".mp4";
            $path_rendered_video = $this->scripts_path . self::video_ready_dir . $rendered_name;
            $logger->info("WORKER RENDER $job_id Looking for generated video: $path_rendered_video");

            if($fs->exists($path_rendered_video)) {
                //Copying file to folder
                $targetFile = $this->render_path.$rendered_name;
                $logger->info("WORKER RENDER $job_id File found!!. Copying to : $targetFile");
                $fs->copy($path_rendered_video, $targetFile);

                //Settgin video entity
                $video= $this->em->getRepository('BackendBundle:Video')->findOneBy(array('id' => $video_id));
                $video->setRender($targetFile);
                $this->em->flush();

                //si todo esta correcta, se envia un correo indicando que el video ha sido terminado
                $alessoService = $this->container->get('ch212app.alesso.service');
                $to       = $user->getEmail();
                $lang     = $user->getLocale();
                $type     = 'video_ready';
                $hotspot  = $video->getHotspot();
                $test     = false;
                $store_id = null;
                $eancode  = null;
                $logger->info("WORKER RENDER $job_id Sending email to: $to user: $user_name lang: $lang hotspot: $hotspot id: $video_id");
                $result = $alessoService->userSendEmail($to, $user_name, $lang, $type, $hotspot, $video_id, $test, $store_id, $eancode);
                $logger->info("WORKER RENDER $job_id The email was sended");
                var_dump($result);
            }
            else 
            {
                $logger->error("WORKER RENDER $job_id File not found: $path_rendered_video");
            	$video = $this->em->getRepository('BackendBundle:Video')->findOneBy(array('id' => $video_id));
            	$video->setRender("ERROR: $buildCommand");
            	$this->em->flush();
            }
        } 
        catch (Exception $e) 
        {
            $logger->error("WORKER RENDER $job_id video: $full_path_video command: $buildCommand");
            return False;
        }        
        $logger->info("WORKER RENDER $job_id *** Finishing process ... ***");
        return true;
    }

}
?>
