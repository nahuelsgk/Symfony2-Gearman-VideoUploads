<?php
namespace CH212app\BackendBundle\Service;

use Symfony\Component\HttpKernel\Log\LoggerInterface as LoggerInterface;
use Mmoreram\GearmanBundle\Service\GearmanClient as GearmanClient;
use CH212app\BackendBundle\Entity\Video as Video;


/* Exceptions:
 * 1000: "Filter not valid"
 * 1001: "Header not valid"
 */

class VideoQueueManager
{

	private $gearman;

	private $logger;

	public function __construct(GearmanClient $gearman, LoggerInterface $logger)
	{
		$this->gearman = $gearman;
		$this->logger  = $logger;
	}

	/**
	 * 
	 * @param Video $video
	 * @param string $filter: italiano | waldengrid | lightleaks
	 * @param string $header: header_a | header_b
	 * @return multitype:unknown
	 */
	public function sendGenerateRender(Video $video, $filter, $header)
	{
		if ($filter != 'italiano' && $filter != 'waldengrid' && $filter != 'lightleaks') throw new \Exception("Filter not valid", "1000");
		if ($header != "header_a" && $header != "header_b") throw new \Exception("Header not valid", "1001");

		//Send to generate the three previews             
		$result_filter = $this->gearman->doBackgroundJob('CH212appBackendBundleWorkersVideoWorkers~Render-video',
            json_encode(
                array('filtro'   => $filter,
		    		'video_id'   => $video->getId(),
                    'header'     => $header
                )
            )
		);

		$this->logger->info("Alesso Service Video Manager. ", array('video_path' => $video->getAbsolutePath(), 'job' => $result_filter));

		$results = array($result_filter);

		return $results;
	}

	/**
	 * Send to the queue 3 jobs: each one, each preview filter
	 *
	 * @param Video $video
	 * @return multitype:unknown
	 */
	public function sendGeneratePreview(Video $video)
	{
		$video_path = $video->getAbsolutePath();

		//Send to generate the three previews
		$result_filter_1 = '';
		//NO FUNCIONA EL SCRIPT QUE LLAMA EL TRABAJO
 		$result_filter_1 = $this->gearman->doBackgroundJob('CH212appBackendBundleWorkersVideoWorkers~Preview_generator',
 				json_encode(array('filtro' => 'waldengrid', 'video_path' => $video_path, 'video_id' => $video->getId()))
 		);

		$result_filter_2 = '';
		$result_filter_2 = $this->gearman->doBackgroundJob('CH212appBackendBundleWorkersVideoWorkers~Preview_generator',
				json_encode(array('filtro' => 'italiano', 'video_path' => $video_path, 'video_id' => $video->getId()))
		);
		
		$result_filter_3 = '';
 		$result_filter_3 = $this->gearman->doBackgroundJob('CH212appBackendBundleWorkersVideoWorkers~Preview_generator',
 				json_encode(array('filtro' => 'lightleaks', 'video_path' => $video_path, 'video_id' => $video->getId()))
 		);


		$this->logger->info("Alesso Service Video Manager. ", array('video_path' => $video_path, 'job_1' => $result_filter_1, 'job_2' => $result_filter_2, 'job_3' => $result_filter_3));

		$results = array($result_filter_1, $result_filter_2, $result_filter_3);

		return $results;
	}
}


?>
