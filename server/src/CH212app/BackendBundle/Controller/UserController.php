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
use CH212app\BackendBundle\Entity\Store as Store;
use CH212app\BackendBundle\Entity\User as User;
use CH212app\BackendBundle\Entity\Gift as Gift;
use CH212app\BackendBundle\Entity\EANCodeUsed as EANCodeUsed;
use CH212app\BackendBundle\Tools\GenericTools as GenericTools;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UserController extends Controller
{

	/**
	 * @Route("/admin/user/login", name="_admin_user_login")
	 * @Template
	 */
	public function userLoginAction()
	{
		$user = new User();
		$form = $this->createFormBuilder($user)
		->add('email')
		->add('eancode', 'text', array(
				'label'	   => 'EAN CODE',
				'mapped'   => false,
				'required' => false
		))
		->getForm();

		$request = $this->getRequest();

		if ($request->getMethod() == 'POST')
		{
			$form->bind($request);
			if ($form->isValid())
			{
				$user = $form->getData();

				//@TODO: Read input: THIS MUST DONE ALSO IN THE WS
				$email			   = $user->getEmail();
				$alreadyRegistered = false;
				if (isset($request->request->get('form')['alreadyRegistered']))
					$alreadyRegistered = $request->request->get('form')['alreadyRegistered'];

				//init some variables...
				$eancodeString = '';
				if (isset($request->request->get('form')['eancode']))
					$eancodeString = $request->request->get('form')['eancode'];

				//**Common logic for the service**//
				//If user say that is already registered
				$alessoService = $this->get('ch212app.alesso.service');
				$user_info = $alessoService->userLogin($email, $eancodeString);

				return $this->redirect($this->generateUrl('_admin_user_profile', array('user_id' => $user_info->getId())));
			}
		}
		return array('form' => $form->createView());
	}

	/**
	 * @Route("/admin/user/new", name="_admin_user_add")
	 * @Template()
	 */
	public function userAddAction()
	{
		$user = new User();
		$form = $this->createFormBuilder($user)
		->add('name')
		->add('surname')
		->add('email')
		->add('hotspot', 'choice', array(
				'choices' => array(
						'kiss' => 'Kiss',
						'dance' => 'Dance',
						'ready' => 'Ready',
						'selfie' => 'Selfie',
				),
		))
		->add('dateBirth')
		->add('zipcode')
		->add('country', 'country')
		->add('store', 'entity', array(
				'class'       => 'BackendBundle:Store',
				'property'    => 'address',
				'empty_value' => 'No store',
				'required'	  => false
		))
		->add('eancode', 'text', array(
				'label'	   => 'EAN CODE',
				'mapped'   => false,
				'required' => false
		))
		->add('locale', 'text')
		->getForm();
		$request = $this->getRequest();
		if ($request->getMethod() == 'POST')
		{
			$form->bind($request);
			if ($form->isValid()) {
				//Read info
				$user = $form->getData();
				$name       	   = $user->getName();
				$surname    	   = $user->getSurname();
				$dateBirth  	   = $user->getDateBirth();
				$store	    	   = $user->getStore();
				$hotSpot 	 	   = $user->getHotSpot();
				$email			   = $user->getEmail();
				$zipcode           = $user->getZipCode();
				$country		   = $user->getCountry();
				$locale			   = $user->getLocale();
				$store_id		   = '';
				$eancodeString     = '';
				$ip				   = GenericTools::get_client_ip();
				if (isset($request->request->get('form')['eancode']))
					$eancodeString = $request->request->get('form')['eancode'];


				$alessoService = $this->get('ch212app.alesso.service');
				$user = $alessoService->userCreate($email, $name, $surname, $dateBirth, $hotSpot, $zipcode, $country, $eancodeString, $store_id, $locale, $ip);
				return $this->redirect($this->generateUrl('_admin_user_profile', array('user_id' => $user->getId())));
			}
		}
		return array('form' => $form->createView());
	}

	/**
	 * @Route("/admin/list_users", name="_admin_list_users");
	 * @Template()
	 */
	public function userListAction(Request $request)
	{
		$userManager = $this->get('fos_user.user_manager');
		$users = $userManager->findUsers(array());

		$paginator = $this->get('knp_paginator');
		$pagination = $paginator->paginate(
				$users,
				$request->query->get('page',1),
				10
		);

		return array('pagination' => $pagination);
	}

	/**
	 * Admin view for testing and building a link to confirm video
	 *
	 * @Route("/admin/confirm-video-confirmation/{user_id}/{video_id}", name="_admin_approve_video_by_user_confirmation")
	 * @Template()
	 */
	public function userConfirmVideoConfirmationAction($user_id, $video_id)
	{
		$alessoService = $this->get('ch212app.alesso.service');
		$url     = $alessoService->buildUrlConfirmactionVideoByUser($user_id,$video_id, false);
		$url_abs = $alessoService->buildUrlConfirmactionVideoByUser($user_id,$video_id, true);

		return array(
				'relative_link_to_confirm' => $url,
				'absolute_link_to_confirm' => $url_abs
		);
	}

	/**
	 * @Route("/admin/user/{user_id}", name="_admin_user_profile" )
	 * @Template()
	 *
	 * @param integer user_id
	 * Admin view for see user profile
	 */
	public function userProfileAction($user_id)
	{
		$userManager = $this->get('fos_user.user_manager');
		$user	     = $userManager->findUserBy(array('id' => $user_id));

		if ($user == null) throw $this->createNotFoundException();
		$form = $this->createFormBuilder($user)
		->add('name')
		->add('surname')
		->add('email')
		->add('hotSpot')
		->add('dateBirth')
		->add('zipcode')
		->add('country', 'country')
		->add('username')
		->getForm();
		return array(
				'form'       => $form->createView(),
				'pagination' => $user->getVideos()
		);
	}

	/**
	 * @Route("/admin/users-download", name="_admin_user_download" )
	 *
	 * Function to download the users as CSV. Please see the last lines to see char encodings.
	 */
	public function usersDownloadCSVAction()
	{
		$userManager = $this->get('fos_user.user_manager');
		$users       = $userManager->findUsers(array());
		$csv_content = array();

		foreach($users as $user)
		{
			$csv_row       = array();
			$csv_row[]     = $this->buildStringForCSV($user->getName());
			$csv_row[]     = $this->buildStringForCSV($user->getSurname());
			$csv_row[]	   = $this->buildStringForCSV($user->getEmail());
			$csv_row[]	   = $user->getDateBirth() != null ? $this->buildStringForCSV($user->getDateBirth()->format('d-m-Y')) : '';
			$csv_row[]	   = $this->buildStringForCSV($user->getCountry());
			$csv_row[]	   = $this->buildStringForCSV($user->getZipcode());
			$csv_string    = implode($csv_row, ";");
			$csv_content[] = $csv_string;
		}

		$csv      = implode($csv_content, "\r\n");
		//Force ISO-8859-1 to view correctly the CSV spanish chars on Microsoft Excel
		$csv      = iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $csv);
		$response = new Response();
		$response->setContent($csv);
		$response->headers->set('Content-Type', 'text/csv; charset=ISO-8859-1');
		$response->headers->set('Content-Disposition','attachment; filename="export.csv"');
		$response->setCharset('ISO-8859-1');
		return $response;
	}

	private function buildStringForCSV($variable)
	{
		return 	"'".$variable."'";
	}

	/**
	 * @Route("/admin/confirm-video/{token}/{user_id}/{video_id}", name="_admin_approve_video_by_user")
	 *
	 * Action to confirm a video by user.
	 */
	public function userConfirmVideoAdminAction($token, $user_id, $video_id)
	{
		$em    = $this->getDoctrine()->getManager();
		$video = $em->getRepository('BackendBundle:Video')->findOneById($video_id);

		$alessoService = $this->get('ch212app.alesso.service');

		//Check if the user has this video
		if ($user_id == $video->getUser()->getId())
		{
			//Check if the token is correct
			if ($alessoService->validateToken($token, $user_id, $video_id) == true)
			{
				$video->setConfirmedByUser(true);
				$em->flush();
				return $this->redirect($this->generateUrl('_admin_non_confirmed_videos_list'));
			}

		}
		throw $this->createNotFoundException("Controller: A error has happened confirming the user's video");
	}

	/**
	 * @Route("/confirm/{approve_video_token}", name="_public_approve_video_by_user")
	 *
	 * Action to confirm a video by user. This action must:
	 * - Check the video
	 * - Push the video to the queue
	 */
	public function userConfirmVideoPublicAction($approved)
	{
	}

	/**
	 * @Route("/unsuscribe/{user_token}/", name="_public_user_unsuscribe")
	 * @Template()
	 *
	 * @param integer $user_id
	 * @param string $lang
	 * @return multitype:
	 */
	public function userUnsuscribeAction($user_token)
	{
		$alessoService = $this->get('ch212app.alesso.service');
		$user_id 	   = $alessoService->getUserIdFromUserApiToken($user_token);
		$um            = $this->get('fos_user.user_manager');
		$user          = $um->findUserBy(array('id' => $user_id));

		$request = $this->getRequest();
		if($request->getMethod() =='POST')
		{
			$user->setUnsuscribe(new \DateTime('now'));
			$um->updateUser($user);
			return array('name' => $user->getName(), 'thank_you' => true);
		}
		return array('name' => $user->getName(), 'thank_you' => false, 'user_token' => $user_token);
	}

	/**
	 *
	 * @param unknown $lang
	 * @return multitype:
	 */
	public function userUnsuscribeConfirmation($lang)
	{
		return array();
	}

	/**
	 * @Route("/admin/send-test-mail", name="_admin_user_test_mail")
	 * @Template()
	 */
	public function userTestEmailAction(Request $request)
	{
		$form = $this->createFormBuilder()
		->add('to', 'text', array('label' => 'To'))
		->add('name', 'text')
		->add('lang', 'choice', array(
				'choices' => array(
						'en' => 'English',
						'es' => 'Spanish',
						'pt' => 'Portuguese'
				)

		))
		->add('type', 'choice', array(
				'choices' => array(
						'thanks_registering' => 'Thanks for registering',
 						'login' => 'Login + push EANCODE',
 						'participate' => 'File upload confirmation: wow that\'s a great <hotspot>',
 						'approved_video' => 'Video approved: thanks for participating',
                        'video_ready' => 'Your video is ready: thanks for participating'
				)
		))
		->add('store', 'entity', array(
				'class'       => 'BackendBundle:Store',
				'property'    => 'address',
				'empty_value' => 'No store',
				'required'	  => false,
				'label'		  => 'Registering: only for registering type'
		))
		->add('hotspot', 'choice', array(
				'choices' => array(
						'kiss' => 'Kiss',
						'dance' => 'Dance',
						'ready' => 'Ready',
						'selfie' => 'Selfie',
				),
				'label' => 'Participate: Hotspot ( only if "Video upload" is selected ) '
		))
		->add('video_id', 'integer',array(
				'required' => false		,
				'label' => 'Participate & Approved(required if you dont check "test" button): Video id'
		))
		->add('eancode', 'checkbox', array(
				'label' => 'Register & login: puts a random EANCODE',
				'required' => false,
				'mapped'   => false
		))
		->add('test', 'checkbox', array(
				'label' => 'Just a test: don\'t grab a valid email neither valid id or valid email',
				'required' => false,
				'mapped'   => false
		))
		->getForm();

		$result = array();
		if ($request->getMethod() == 'POST')
		{
			$form->bind($request);
			$to       = $request->request->get('form')['to'];
			$lang     = $request->request->get('form')['lang'];
			$name     = $request->request->get('form')['name'];
			$type     = $request->request->get('form')['type'];
			$video_id = $request->request->get('form')['video_id'];
			$store_id = $request->request->get('form')['store'];

			$hotspot = '';
			if($type=='participate')
			{
				$hotspot  = $request->request->get('form')['hotspot'];
			}
			elseif($type == 'video_ready')
			{
				$video = $this->getDoctrine()->getManager()->getRepository('BackendBundle:Video')->findOneBy(array('id' => $video_id));
				$hotspot = $video->getHotspot();
			}
			
			$test     = isset($request->request->get('form')['test']) && $request->request->get('form')['test'] == 1  ? true:false;
			$eancode  = isset($request->request->get('form')['eancode']) && $request->request->get('form')['eancode'] == 1  ? 'eancode test':null;

			if ($form->isValid())
			{
				$alessoService = $this->get('ch212app.alesso.service');
				try{
					$result        = $alessoService->userSendEmail($to, $name, $lang, $type, $hotspot, $video_id, $test, $store_id, $eancode);
				}
				catch (\Exception $e)
				{
					throw $this->createNotFoundException("Controller: Error on service. Please contact developers. ".$e->getMessage());
				}
			}
		}
		return array(
				'form'   => $form->createView(),
				'result' => $result);
	}

}
