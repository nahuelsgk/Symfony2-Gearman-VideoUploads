<?php
namespace CH212app\BackendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;
use CH212app\BackendBundle\GearmanJob\StringReverse as StringReverse;

class QueueController extends Controller
{
	/**
	 * @Route("/admin/queue/send_test", name="_admin_queue_send_test")
	 * @Template()
	 *
	 * Performs the small job test wating for a result
	 */
	public function testSendToQueueAction(Request $request)
	{
		$result = '';

		if ($request->getMethod() == "POST")
		{
			$gearman    = $this->get('gearman');
			$result     = $gearman->doJob('CH212appBackendBundleWorkersBackendWorker~test',
											json_encode(array('value1')));
		}

		return array('result' => $result);
	}

	/**
	 * @Route("/admin/queue/send-test-background", name="_admin_queue_send_test_background")
	 * @Template()
	 *
	 * Performs a slow operation job not waiting for result.
	 *
	 * @return multitype:string
	 */
	public function testSendBackgrounJobAction(Request $request)
	{
		$result = '';
		$form = $this->createFormBuilder()
		->add('parameter', 'text')
		->getForm();

		if ($request->getMethod() == "POST"){
			$parameter = $request->request->get('form')['parameter'];
			$gearman   = $this->get('gearman');
			$result    = $gearman->doBackgroundJob('CH212appBackendBundleWorkersBackendWorker~slowOperation180seconds',
					json_encode(array('parameter' => $parameter)));

		}
		return array('form' => $form->createView(), 'result' => $result);
	}

	/**
	 * @Route("/admin/queue/send-test-task", name="_admin_queue_send_test_task")
	 * @Template()
	 *
	 * @return multitype:string
	 */
	public function testSendBackgroundTaskAction(Request $request)
	{
		$result = '';
		if ($request->getMethod() == "POST"){
			$gearman = $this->get('gearman');
			$result  = $gearman->doBackgroundJob('CH212appBackendBundleWorkersBackendWorker~slowOperation180seconds',
					json_encode(array('value1')));

		}
		return array('result' => $result);
	}

	/**
	 * @Route("/admin/queue/test-generate-preview", name="_admin_queue_test_preview")
	 * @Template()
	 * @param Request $request
	 */
	public function testGenerateFrameAction(Request $request)
	{
		$form = $this->createFormBuilder()
		->add('video_id', 'integer', array(
			'label' => 'Select video id'
		))
		->getForm();

 		$results = array();
		if ($request->getMethod() == 'POST')
		{
			$video_id   = $request->request->get('form')['video_id'];

			$video               = $this->getDoctrine()->getRepository('BackendBundle:Video')->findOneBy(array('id' =>$video_id));
			$video_queue_manager = $this->get('ch212app.alesso.video_queue_manager');
			$results             = $video_queue_manager->sendGeneratePreview($video);
		}
		return array('form' => $form->createView(), 'results'=> $results);
	}

	/**
	 * @Route("/admin/queue/test-request-preview", name="_admin_queue_test_request_preview")
	 * @Template()
	 * @param Request $request
	 */
	public function testGetPreviewAction(Request $request)
	{
		$form = $this->createFormBuilder()
		->add('video_id', 'integer', array(
			'label' => 'Select video id'
		))
		->getForm();

		$results = array();
		if ($request->getMethod() == 'POST')
		{
			$video_id   = $request->request->get('form')['video_id'];
			$alessoService = $this->get('ch212app.alesso.service');
            $results = $alessoService->getPreviewsURL($video_id);;
		}
		return array('form' => $form->createView(), 'results'=> $results);
	}

	/**
	 * @Route("/admin/queue/test-render-videos", name="_admin_queue_test_render_video")
	 * @Template()
	 * @param Request $request
	 */
	public function testRenderVideoAction(Request $request)
	{
		$form = $this->createFormBuilder()
		->add('video_id', 'integer', array(
				'label' => 'Select video id'
		))
        ->add('filter', 'choice', array(
                'choices' => array(
                        'italiano' => 'italiano',
                        'lightleaks' => 'lightleaks',
                        'waldengrid' => 'waldengrid'
                )
        ))
        ->add('header', 'choice', array(
                'choices' => array(
                        'header_a' => 'header_a',
                        'header_b' => 'header_b'
                )
        ))
		->getForm();
        $results = array();
		if ($request->getMethod() == 'POST')
		{
			$video_id = $request->request->get('form')['video_id'];
			$filter   = $request->request->get('form')['filter'];
			$header   = $request->request->get('form')['header'];
			$video    = $this->getDoctrine()->getRepository('BackendBundle:Video')->findOneBy(array('id' =>$video_id));
			
			$video_queue_manager = $this->get('ch212app.alesso.video_queue_manager');
			
			$results             = $video_queue_manager->sendGenerateRender($video, $filter, $header);

		}
		return array('form' => $form->createView(), 'results'=> $results);
	}

	/**
	 * @Route("/admin/queue/test-get-rendered-video", name="_admin_queue_request_rendered_video")
	 * @Template()
	 * @param Request $request
	 */
	public function testRequestRenderedVideoAction(Request $request)
	{
		$form = $this->createFormBuilder()
		->add('video_id', 'integer', array(
				'label' => 'Select video id'
		))
		->getForm();

        $video_id = '';
        $results = array();

		if ($request->getMethod() == 'POST')
		{
			$video_id   = $request->request->get('form')['video_id'];
			$alessoService = $this->get('ch212app.alesso.service');
            $results = $alessoService->getRenderedUrl($video_id);;
		}
		return array('form' => $form->createView(), 'results'=> $results, 'video_id'=>$video_id);
	}
}
?>
