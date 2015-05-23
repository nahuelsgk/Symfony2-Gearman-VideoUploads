<?php
namespace CH212app\BackendBundle\Controller;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Locale\Locale;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\File\UploadedFile as UploadedFile;
use CH212app\BackendBundle\Entity\Video as Video;
use CH212app\BackendBundle\Entity\User as User;
use Symfony\Component\HttpFoundation\Response;

class VideoController extends Controller
{
	/**
	 * @Route("/admin/all_videos", name="_admin_all_videos")
	 * @Template("BackendBundle:Video:allVideos.html.twig")
	 */
	public function videoAllVideosAction(Request $request)
	{
		$videos = $this->getDoctrine()
		->getRepository('BackendBundle:Video')
		->findBy(array(), array('created' => 'DESC'));
	
		$paginator = $this->get('knp_paginator');
		$pagination = $paginator->paginate(
				$videos,
				$request->query->get('page',1),
				5
		);
	
		return array(
				'title_video_list_view' => 'List all videos',
				'pagination' => $pagination
	
		);
	}
	
	/**
	 * @Route("/admin/approved-videos", name="_admin_approved_videos_list")
	 * @Template("BackendBundle:Video:allVideos.html.twig")
	 */
	public function videoApprovedVideoListAction(Request $request)
	{
		$videos = $this->getDoctrine()
		->getRepository('BackendBundle:Video')
		->findBy(
				array(
						'status' 		 => Video::STATUS_APPROVED,
						'confirmedByUser' => true
				),
				array('created' => 'DESC')
		);
	
		$paginator = $this->get('knp_paginator');
		$pagination = $paginator->paginate(
				$videos,
				$request->query->get('page',1),
				5
		);
	
		return array(
				'title_video_list_view' => 'Approved videos',
				'pagination' => $pagination
		);
	}
	
	/**
	 * @Route("/admin/rejected-videos", name="_admin_rejected_videos_list")
	 * @Template("BackendBundle:Video:allVideos.html.twig")
	 */
	public function videoRejectedVideoListAction(Request $request)
	{
		$videos = $this->getDoctrine()
		->getRepository('BackendBundle:Video')
		->findBy(
				array(
						'status' => Video::STATUS_REJECTED,
						'confirmedByUser' => true
				),
				array('created' => 'DESC'));
	
		$paginator = $this->get('knp_paginator');
		$pagination = $paginator->paginate(
				$videos,
				$request->query->get('page',1),
				5
		);
	
		return array(
				'title_video_list_view' => 'Rejected videos',
				'pagination' => $pagination
		);
	}
	
	/**
	 * @Route("/admin/new-videos", name="_admin_new_videos_list")
	 * @Template("BackendBundle:Video:allVideos.html.twig")
	 */
	public function videoNewVideoListAction(Request $request)
	{
		$videos = $this->getDoctrine()
		->getRepository('BackendBundle:Video')
		->findBy(
				array(
						'status' => Video::STATUS_NEW,
						'confirmedByUser' => true
				)
				, array('created' => 'DESC')
		);
	
		$paginator = $this->get('knp_paginator');
		$pagination = $paginator->paginate(
				$videos,
				$request->query->get('page',1),
				5
		);
	
		return array(
				'title_video_list_view' => 'New uploaded videos confirmed by user',
				'pagination' => $pagination);
	}
	
	/**
	 * @Route("/admin/non-confirmed-by-user-videos", name="_admin_non_confirmed_videos_list")
	 * @Template("BackendBundle:Video:allVideos.html.twig")
	 */
	public function videoNonConfirmedVideoListAction(Request $request)
	{
		$videos = $this->getDoctrine()
		->getRepository('BackendBundle:Video')
		->findByConfirmedByUser(false, array('created' => 'DESC'));
	
		$paginator = $this->get('knp_paginator');
		$pagination = $paginator->paginate(
				$videos,
				$request->query->get('page',1),
				5
		);
	
		return array(
				'title_video_list_view' => 'New uploaded videos',
				'pagination' => $pagination);
	}
	
	/**
	 * @Route("/admin/add_video", name="_admin_add_video")
	 * @Template()
	 *
	 * This a test for upload videos from the backend
	 */
	public function videoAddAction(Request $request)
	{
		$video = new Video();
	
		$form  = $this->createFormBuilder($video)
		->add('file')
		->add('hotspot', 'choice', array(
				'choices' => array(
						'kiss' => 'Kiss',
						'dance' => 'Dance',
						'ready' => 'Ready',
						'selfie' => 'Selfie',
				),
		))
		->add('userId','integer', array(
				'label'  => 'ID usuario',
				'mapped' => false))
				->getForm();
	
		if ($request->getMethod() == 'POST') {
			$form->bind($request);
			if ($form->isValid()) {
				$user_id       = $request->request->get('form')['userId'];
				$alessoService = $this->get('ch212app.alesso.service');
	
				//Truco rapido para conseguir el uploadedFile y pasarselo al servicio aprovechando la FORM api de Symfony2
				$video = $form->getData();
				$alessoService->uploadVideoFromUserInHotSpot(
						$user_id,
						$video->getFile(),
						$request->getClientIp(),
						$video->getHotspot()
				);
				return $this->redirect($this->generateUrl('_admin_non_confirmed_videos_list'));
			}
		}
		return array('form' => $form->createView());
	}
	
	/**
	 * @Route("/admin/reject_video/{video_id}", name="_admin_reject_video")
	 */
	public function videoRejectAction($video_id)
	{
		$em    = $this->getDoctrine()->getManager();
		$video = $em->getRepository('BackendBundle:Video')->find($video_id);
	
		if (!$video) throw $this->createNotFoundException("No video found for id ".$id);
	
		$video->setStatus(Video::STATUS_REJECTED);
		$em->flush();
	
		//Redirigimos al refererer
		return $this->redirect($this->getRequest()->headers->get('referer'));
	}
	
	/**
	 * @Route("/admin/approve_video/{video_id}", name="_admin_approve_video")
	 */
	public function videoApproveAction($video_id)
	{
		$em    = $this->getDoctrine()->getManager();
		$video = $em->getRepository('BackendBundle:Video')->find($video_id);
	
		if (!$video) throw $this->createNotFoundException("No video found for id ".$id);
	
		try{
			$video->setStatus(Video::STATUS_APPROVED);
			$em->flush();
	
			$user = $video->getUser();
				
			$alessoService = $this->get('ch212app.alesso.service');
			$alessoService->userSendEmail(
					$user->getEmail(),
					$user->getName(),
					$user->getLocale(),
					'approved_video',
					null,
					null,
					false,
					null
			);
		}
		catch (\Exception $e)
		{
			throw $this->createNotFoundException("Controller: a problem during the approvation: ".$e->getMessage());
		}
		//Redirigimos al refererer
		return $this->redirect($this->getRequest()->headers->get('referer'));
	}
	
	/**
	 * @Route("/admin/remove_video/{video_id}", name="_admin_remove_video")
	 */
	public function videoRemoveAction($video_id)
	{
		$em    = $this->getDoctrine()->getManager();
		$video = $em->getRepository('BackendBundle:Video')->find($video_id);
	
		if (!$video) throw $this->createNotFoundException("No video found for id ".$id);
	
		$em->remove($video);
		$em->flush();
	
		//Redirigimos al refererer
		return $this->redirect($this->getRequest()->headers->get('referer'));
	}
	
	/**
	 * @Route("/admin/watch_video/{video_id}", name="_admin_watch_video")
	 */
	public function videoWatchAction($video_id)
	{
		$em    = $this->getDoctrine()->getManager();
		$video = $em->getRepository('BackendBundle:Video')->find($video_id);
		$video_uploaded = new UploadedFile($video->getAbsolutePath(), $video->getMimeType());
		$response = new Response(
				file_get_contents($video->getAbsolutePath()),
				200);
		$response->headers->set('Content-Type', $video_uploaded->getMimeType());
		return $response;
	}
	
	/**
	 *
	 * @Route("/admin/download_video/{video_id}", name="_admin_download_video")
	 */
	public function videoDownloadAction($video_id)
	{
		$em    = $this->getDoctrine()->getManager();
		$video = $em->getRepository('BackendBundle:Video')->find($video_id);
		$video_uploaded = new UploadedFile($video->getAbsolutePath(), $video->getMimeType());
		$response = new Response(
				file_get_contents($video->getAbsolutePath()),
				200);
		$response->headers->set('Pragma', 'public');
		$response->headers->set('Expires', 0);
		$response->headers->set('Accept-Ranges', 'bytes');
		$response->headers->set('Content-Length', filesize($video->getAbsolutePath()));
		$response->headers->set('Content-Type', 'octet/stream');
		$response->headers->set('Content-Disposition', 'attachment;filename="'.basename($video->getAbsolutePath()));
		$response->headers->set('Content-Transfer-Encoding', 'binary');
		$response->headers->set('Connection', 'close');
	
		return $response;
	}
	
}