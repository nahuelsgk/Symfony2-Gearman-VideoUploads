<?php 
namespace CH212app\BackendBundle\Workers;

use Mmoreram\GearmanBundle\Driver\Gearman;
use Symfony\Component\DependencyInjection\ContainerInterface as Container;

/**
 * @Gearman\Work(
 *     iterations    = 0,
 *     description   = "Worker test description",
 *     defaultMethod = "doBackground",
 *     service       = "ch212app.alesso.worker"
 * )
 */
class BackendWorker
{
	
	private $container;
	
	public function __construct(Container $container)
	{
		$this->container = $container;
	}
	
    /**
     * Test method to run as a job
     *
     * @param \GearmanJob $job Object with job parameters
     *
     * @return boolean
     *
     * ITERATIONS: 
     * El numero de iteraciones que soporta el worker. 
     * Cuando supera este numero de iteraciones. Muere
     * Si es 0, el numero de iteraciones es infinito.
     * 
     * @Gearman\Job(
     *     iterations = 0,
     *     name = "test",
     *     description = "This is a description"
     * )
     */
    public function testA(\GearmanJob $job)
    {
        echo 'Job testA done!' . PHP_EOL;
		$alessoService = $this->container->get('ch212app.alesso.service');
    	try{
    		$to       = 'nahuelsgk@mailinator.com';
    		$name     = 'Nahuel'; 
    		$lang     = 'en';
    		$type     = 'video_ready';
    		$hotspot  = 'dance';
    		$video_id = 1;
    		$test     = false;
    		$store_id = null;
    		$eancode  = null;
			$result = $alessoService->userSendEmail($to, $name, $lang, $type, $hotspot, $video_id, $test, $store_id, $eancode);
		}
		catch (\Exception $e)
		{
			echo "Worker: Error on service. Please contact developers. ".$e->getMessage();
		}
		return true;
    }

    /**
     * Test method to run as a job
     *
     * @param \GearmanJob $job Object with job parameters
     *
     * @return boolean
     *
     * @Gearman\Job(
     *     defaultMethod = "doLowBackground"
     * )
     */
    public function testB(\GearmanJob $job)
    {
        echo 'Job testB done!' . PHP_EOL;

        return true;
    }
    
    /**
     * Test method to run as a slow job
     * 
     * @param \GearmanJob $job
     * @return boolean
     * 
     * @Gearman\Job(
     * 	   iterations = 0,
     * 	   name = "slowOperation180seconds",
     *     defaultMethod = "doLowBackground"
     * )
     */
    public function testSlowOperation(\GearmanJob $job)
    {
    	echo "Starting a slow op..." . PHP_EOL;
    	$data = json_decode($job->workload(),true);
    	for ($i=0; $i<180; $i++) {
    		echo $data['parameter'];
    		sleep(1);
    	}
    	$alessoService = $this->container->get('ch212app.alesso.service');
    	try{
    		$to       = 'nahuelsgk@mailinator.com';
    		$name     = 'Nahuel';
    		$lang     = 'en';
    		$type     = 'video_ready';
    		$hotspot  = 'dance';
    		$video_id = 1;
    		$test     = false;
    		$store_id = null;
    		$eancode  = null;
    		$result = $alessoService->userSendEmail($to, $name, $lang, $type, $hotspot, $video_id, $test, $store_id, $eancode);
    	}
    	catch (\Exception $e)
    	{
    		echo "Worker: Error on service. Please contact developers. ".$e->getMessage();
    	}
    	echo "Finishing a slow op..." . PHP_EOL;
    	return true;
    }
}
?>