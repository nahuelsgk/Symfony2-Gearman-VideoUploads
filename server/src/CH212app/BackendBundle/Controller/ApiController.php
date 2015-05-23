<?php

namespace CH212app\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use CH212app\BackendBundle\Entity\Video as Video;
use CH212app\BackendBundle\Entity\User as User;
use CH212app\BackendBundle\Tools\GenericTools as GenericTools;

/**
 * @Route("/api")
 * 
 * Errors handlers code
 * [error_code]
 * 
 */
class ApiController extends Controller
{
    /**
     * @Route("/hello")
     */
    public function helloAction()
    {
        return new JsonResponse(array('world' => 'world'));
    }

    /**
     * @Route("/todos")
     */
    public function todosAction()
    {
        $todos = array(
            array('text'=>'learn angular', 'done'=>true),
            array('text'=>'build an angular app', 'done'=>false),
            );
        return new JsonResponse($todos);
    }
    
    /**
     * @Route("/upload-video")
     * @Method({"POST"})
     * 
     * @param: userId:  The user id raw!!
     * @param: video:   File for the video
     * @param: hotSpot: Can be one of the hotspots
     * 
     *  WS for upload video 
     *  @TODO: Read USER. Actually no user is readed
     */
    public function apiUploadFileAction()
    {
    	$request = $this->getRequest();
    
    	if ($request->getMethod() == 'POST'){
    		$user_id      = $request->request->get("userId");
    		if($user_id == null) return new JsonResponse(array("message" => "No user received"), 403);
    		
    		$alessoService = $this->get('ch212app.alesso.service');
    		if($alessoService->validateUserApiToken($user_id) == false) return new JsonResponse(array("message" => "Invalid User Token"), 403);
    		
    		$uploadedFile = $request->files->get('file');
    		if($uploadedFile == null) return new JsonResponse(array("message" => "No video received"), 403);
    		    			
    		$hotSpot	  = $request->request->get('hotSpot');
    		if($hotSpot == null) return new JsonResponse(array("message" => "No hotspot received"), 403);
			
    		$logger = $this->get('logger');
    		$logger->info('Alesso Web Service HTTP POST Request /api/upload-video for user id '.$user_id.' on hotspot '.$hotSpot);
    		
    		//Decript user_id: 
    		$user_id = $alessoService->getUserIdFromUserApiToken($user_id);
    		
			try{
				$video = $alessoService->uploadVideoFromUserInHotSpot(
						$user_id,
						$uploadedFile,
						GenericTools::get_client_ip(),
						$hotSpot
				);
			}
			catch(\Exception $e)
			{
				switch($e->getCode())
				{
					case "0006":
						return new JsonResponse(array("message" => "No user with this id", "code" => $e->getCode()), 403);
						break;
						
					default:
						return new JsonResponse(array("Undefined  error. Please notify developers: ".$e->getMessage(), "code" => "0014"), 409);
						break;
				}
			}
			
    		return new JsonResponse(array("message" => "OK", "video_id" => $video->getId(), 'confirm_token' => $video->confirm_token), 200);
    	}
    	
    }
    /**
     * @Route("/upload-video")
	 * @Route("/stores/{country}/{zipcode}/{radius}")
	 * @Route("/user")
     * @Method({"OPTIONS"})
     *
     *  WS for upload video
     *  @TODO: PARCHE CROSS-DOMAINS
     */
    public function returnOK()
    {
    	$request = $this->getRequest();

    	if ($request->getMethod() == 'OPTIONS')
    		return new JsonResponse(array("message" => "OK"), 200);
    	return new JsonResponse(array("message" => "KO"), 400);
    }
    
    /**
     * @Route("/country/{country_code}/has-store")
     * 
     * Return is a country has stores
     */
    public function countryHasStore()
    {
    	return new JsonMessage(array("message" => true), 200);
    }
    
    /**
     * Private generic function to create user array with info to response a query
     * 
     * @param User $user
     * @return multitype:NULL
     */
    private function buildUserResponse($user)
    {
    	$videos = $user->getVideos();
    	$participations = array();
    	if (count($videos))
    	{
	    	foreach($videos as $video)
	    	{
	    		$participations[] = $video->getCreated();
	    	}
    	}
    	
    	$alessoService = $this->get('ch212app.alesso.service');
    	return array(
    		'email' 	     => $user->getEmail(),
    		'id'		     => $alessoService->buildUserApiToken($user->getId()),
    		'username'       => $user->getUserName(),
    		'country'	     => $user->getCountry(),
    		'participations' => $participations,
    		'locale'		 => $user->getLocale(),
    		'name'			 => $user->getName(),
    		'surname'		 => $user->getSurname(),
    	);	
    }
    
    
    /**
     * @Route("/stores/{country}/{zipcode}/{radius}")
     * @Method({"GET"})
     * 
     * @param string country
     * @param string zipcode
     * @param integer radius
     * @return \Symfony\Component\HttpFoundation\JsonResponse|\CH212app\BackendBundle\Controller\JsonReponse
     * 
     * To call the WS:
     * http://212vip.loc/server/web/app_dev.php/api/stores/RU/08020/250
     */
    public function getStoresByCountryByZipCodeAction($country, $zipcode, $radius)
    {
    	
    	$alessoService = $this->get('ch212app.alesso.service');
    	$stores_with_distances = array();
    	
    	try
    	{
    		$logger = $this->get('logger');
    		$logger->info('Alesso Web Service HTTP GET Request /stores',array('country' => $country, 'zipcode' => $zipcode, 'radius' => $radius));
    		$stores_with_distances = $alessoService->getClosestStores($zipcode, $country, $radius);
    	}
    	catch (\Exception $e)
    	{
    		switch($e->getCode())
    		{
    			case "0002":
    				//No stores in this country
    				return new JsonResponse(array(), 200);
    				break;
    				
    			case "0001":
    				//No gifts on this country
    				return new JsonResponse(array(), 200);
    				break;
    				
    			default:
    				return new JsonResponse(array("message"=>"Error on search stores. Please notify developers:".$e->getMessage(),"code"=>"0014"), 409);
    		}
    			
    	}
    	return new JsonResponse(array("stores" => $stores_with_distances), 200);
    }
    
    /**
     * @Route("/user")
     * @Method({"GET"})
     *
     */
    public function userGetAction()
    {
    	return new JsonResponse(array("message" => "OK"), 200);
    }
    
    /**
     *
     * @Route("/user")
     * @Method({"POST"})
     *
     * @param string name
     * @param string surname
     * @param date   dataBirth
     * @param string email
     * @param string hotspot
     * @param string zipcode
     * @param string country
     * @param string eancode optional
     * @return \Symfony\Component\HttpFoundation\JsonResponse|\CH212app\BackendBundle\Controller\JsonReponse
     *
     * Alesso Webservice to create a user.
     * To call the WS: DOMAIN/server/web/app_dev.php/api/user
     */
    public function userPostAction()
    {
    	$request = $this->getRequest();
    	if($request->getMethod() == 'POST')
    	{
    		$name       	   = $request->request->get('name');
    		$surname    	   = $request->request->get('surname');
    		$dateBirth  	   = $request->request->get('birth');
    		$dateBirthDate	   = new \DateTime($dateBirth);
    		$hotSpot 	 	   = $request->request->get('hotSpot');
    		$email			   = $request->request->get('email');
    		$zipcode           = $request->request->get('zipcode');
    		$country		   = $request->request->get('country');
    		$store_id		   = $request->request->get('store');
    		$eancodeString     = $request->request->get('eancode');
    		$locale			   = $request->request->get('locale');
    		$ip				   = GenericTools::get_client_ip();
    		$alessoService = $this->get('ch212app.alesso.service');
    		try
    		{
    			$logger = $this->get('logger');
    			$logger->info('Alesso Web Service HTTP POST Request /api/user',array('name' => $name, 'surname' => $surname, 'dateBirth' => $dateBirth, 'store' => $store_id, 'hotspot' => $hotSpot, 'email' => $email, 'zipcode' => $zipcode, 'country' => $country, 'eancode' => $eancodeString, 'locale' => $locale));
    			$user = $alessoService->userCreate($email, $name, $surname, $dateBirthDate, $hotSpot, $zipcode, $country, $eancodeString, $store_id, $locale, $ip);
    			return new JsonResponse($this->buildUserResponse($user), 200);
    		}
    		catch (\Exception $e)
    		{
    			switch($e->getCode())
    			{
    				case "0003":
    					return new JsonResponse(array('message' => $e->getMessage(), 'code' =>$e->getCode()), 400);
    					break;
    				default:
    					return new JsonResponse(array("message" => "Undefined error: ".$e->getMessage().". Please notify developers", "code" => "0014"), 409);
    					break;
    						
    			}
    		}
    	}
    	return new JsonResponse(array("message" => "Error on POSting user", "code"=>"0014"), 409);
    }
    
    /**
     * @Route("/user")
     * @Method({"PUT"})
     *
     * @param string email
     * @param string eancode optional
     * @return \Symfony\Component\HttpFoundation\JsonResponse|\CH212app\BackendBundle\Controller\JsonReponse
     *
     * Alesso WebService Login
     * To call the WS: DOMAIN/server/web/app_dev.php/api/user
     */
    public function userPutAction()
    {
    	$request = $this->getRequest();
    	$email	 = $request->get('email');
    	$eanCode = $request->get('eancode');
    	if($request->getMethod()=='PUT')
    	{
    		if ($email == '') return new JsonResponse(array("message" => "No parameters received"), 403);
    
    		$alessoService = $this->get('ch212app.alesso.service');
    		$user = new User();
    		try
    		{
    			$logger = $this->get('logger');
    			$logger->info('Alesso Web Service HTTP PUT Request /api/user',array('email' => $email, 'eancode' => $eanCode));
    			$user = $alessoService->userLogin($email, $eanCode);
    			return new JsonResponse($this->buildUserResponse($user), 200);
    		}
    		catch (\Exception $e)
    		{
    			switch($e->getCode())
    			{
    				case "0000":
    					return new JsonResponse(array("message" => $e->getMessage(), "code" => $e->getCode()), 401);
    					break;
    
    				case "0001":
    					return new JsonResponse(array("message" => $e->getMessage(), "code" => $e->getCode()), 404);
    					break;
    						
    				default:
    					return new JsonResponse(array("message" => "Undefined error. Please notify developers", "code"=>"0014"), 409);
    					break;
    			}
    		}
    	}
    	return new JsonResponse(array("message" => "Error on PUTing user"), 400);
    }

    /**
     * @Route("/user/{token}");
     * @Method({"GET"})
     *
     * NOTE: Deprecated service because logic changed.
     * 
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function confirmVideoUserByTokenAction($token)
    {	
    	$alessoService = $this->get('ch212app.alesso.service');
    	try
    	{
    		$logger = $this->get('logger');
    		$logger->info('Alesso Web Service HTTP GET Request /user',array('token' => $token));
    		$user = $alessoService->confirmUserVideo($token);
    		return new JsonResponse($this->buildUserResponse($user), 200);
    	}
    	catch(\Exception $e)
    	{
    		switch($e->getCode())
    		{
    			case "0015":
    				return new JsonResponse(array("message" => "Invalid user token on confirm video", "code" => $e->getCode()), 400);
    				break;	
    					
    			case "0013":
    				return new JsonResponse(array("message" => "The user is not the owner of the video", "code" => $e->getCode()), 404);
    				break;
    				
    			default:
    				return new JsonResponse(array("message" => "Unknow error. Please notify developers: ".$e->getMessage(), "code" => $e->getCode()), 409);
    				break;
    		}
    	}
    	
    	return new JsonResponse(array("message" => "Error on the request" ), 400);
    }

    /**
     * @Route("/user/video/{token}")
     * @Method({"GET"})
     */
    public function getUserByVideoTokenAction($token)
    {
    	$alessoService = $this->get('ch212app.alesso.service');
    	try
    	{
    		$logger = $this->get('logger');
    		$logger->info('Alesso Web Service HTTP GET Request /user',array('token' => $token));
    		$user = $alessoService->getUserFromTokenVideoApprove($token);
    		return new JsonResponse($this->buildUserResponse($user), 200);
    		
    	}
    	catch(\Exception $e)
    	{
    		switch($e->getCode())
    		{
    			default:
    				return new JsonResponse(array("message" => "Unknow error. Please notify developers: ".$e->getMessage(), "code" => $e->getCode()), 409);
    				break;
    		}
    	}
    	return new JsonResponse(array("message" => "Error on the request" ), 400);
    }
    
    /**
     * @Route("/user/confirm-video/{token}");
     * @Method({"POST"})
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function sendConfirmationVideoUserByTokenAction($token)
    {
    	$alessoService = $this->get('ch212app.alesso.service');
    	try
    	{
    		$logger = $this->get('logger');
    		$logger->info('Alesso Web Service HTTP GET Request /user',array('token' => $token));
    		$user = $alessoService->sendConfirmationUserVideo($token);
    		return new JsonResponse($this->buildUserResponse($user), 200);
    	}
    	catch(\Exception $e)
    	{
    		switch($e->getCode())
    		{
    			case "0015":
    				return new JsonResponse(array("message" => "Invalid user token on confirm video", "code" => $e->getCode()), 400);
    				break;
    					
    			case "0013":
    				return new JsonResponse(array("message" => "The user is not the owner of the video", "code" => $e->getCode()), 404);
    				break;
    
    			default:
    				return new JsonResponse(array("message" => "Unknow error. Please notify developers: ".$e->getMessage(), "code" => $e->getCode()), 409);
    				break;
    		}
    	}
    	 
    	return new JsonResponse(array("message" => "Error on the request" ), 400);
    }
    
    /**
     * @Route("/user/{token}/audio")
     * @Method("GET")
     *
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function assignAudioCodeAction($token)
    {
    	$alessoService = $this->get('ch212app.alesso.service');
    	if($alessoService->validateUserApiToken($token) == false)
    	{
    		return new JsonResponse(array("message" => "Invalid User Token from audio assignation"), 403);
    	}
    	try
    	{
    		$user_id                 = $alessoService->getUserIdFromUserApiToken($token);
    		$audioAssignationService = $this->get("ch212app.alesso.assign_audio_code");
    		$code                    = $audioAssignationService->assign($user_id);
    		return new JsonResponse(array("code" => $code->getCode()), 200);
    	}
    	catch(\Exception $e)
    	{
    		switch($e->getCode())
    		{
    			case "1001":
    				return new JsonResponse(array("message" => "No more audio codes ".$e->getMessage(), 409));
    				break;
    				
    			default:
    				return new JsonResponse(array("message" => "Unknow error. Please notify developers: ".$e->getMessage(), 409));
    				break;
    		}
    	}
    
    	return new JsonResponse(array("message"=>"Unknow error"), 403);
    }

    /**
     * @Route("/audio-check")
     * @Method("GET")
     */
    public function audioCheckAction()
    {
    	$logger = $this->get('logger');
    	$logger->info('Alesso Web Service HTTP GET Request /audio-check');
    	$audioAssignationService = $this->get("ch212app.alesso.assign_audio_code");
    	try{
    		$audioAssignationService->isAnyAvailableCode();
    		return new JsonResponse(array("message"=>"There is code to assign", "result" => true), 200);
    	}
    	catch(\Exception $e){
    		switch($e->getCode())
    		{
    			case "1001":
    				return new JsonResponse(array("message"=>"There no code to assign", "result" => false), 200);
    				break;
    				
    			default:
    				return new JsonResponse(array("message"=>"Unknow error", "result" => true), 403);
    				break;
    		}
    	}
    	 
    	return new JsonResponse(array("message"=>"Unknow error"), 403);	
    } 
    
    /**
     * @Route("/participations/{token}")
     * @Method("GET")
     *
     *If token is 0, will return all participations without considering any user 
     * Must return this format  
     {
     "id": "asddsgg234523",//BUILD USER ID
     "position": 5.6, //
     "name": "MARC LOPEZ", //
     "city": "MOSCU", //
     "date": "4/MAY/2015", //
     "isUser": false // Si es una participation del usuario
     }
     */
    public function getParticipationsAction($token)
    {
    	$participations = array();
    	 
    	$logger = $this->get('logger');
    	$logger->info('Alesso Web Service HTTP GET Request /participations',array('token' => $token));
    	
    	$qb = $this->getDoctrine()->getManager()->createQueryBuilder();

    	$user_id = 0;
    	if($token!=0)
    	{
    		$alessoService = $this->get('ch212app.alesso.service');
    		$user_id       = $alessoService->getUserIdFromUserApiToken($token);
    	}
    	$sql = "SELECT u.id, 
				CONCAT(u.name, ' ', u.surname) AS name,
				DATE_FORMAT(v.created, '%d/%m/%Y') AS date,
				u.countryLong AS country,
				RAND()*85 as position, 
				CASE WHEN (u.id = '".$user_id."') THEN 1 ELSE 0 END AS isUser,
				u.countryLong AS country
				FROM video v
				INNER JOIN usuarios u ON v.user_id = u.id
				WHERE u.name IS NOT NULL AND
				u.country IS NOT NULL AND 
				u.countryLong IS NOT NULL
				ORDER BY v.id DESC
				LIMIT 400";
    	
    	$stmt = $this->getDoctrine()->getEntityManager()->getConnection()->prepare($sql);
    	$stmt->execute();
    	$participations = $stmt->fetchAll();
    	
    	//\Doctrine\Common\Util\Debug::Dump(($participations));
    	 	 
    	return new JsonResponse($participations, 200);
    }
    
    
    /**
     * @Route("/user/video/preview/{token}")
     * @Method("POST")
     * 
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function generatePreviewAction($token)
    {
    	$alessoService = $this->get('ch212app.alesso.service');
    	$logger = $this->get('logger');
    	try
    	{
    		$logger->info('Alesso Web Service HTTP POST Request /user/video/preview',array('token' => $token));
    		 
    		if ($alessoService->validateTokenVideoApprove($token) == false) return new JsonResponse(array("message" => "Invalid user token on confirm video", "code" => $e->getCode()), 400);
    		$video = $alessoService->getVideoFromTokenVideoApprove($token);
    		
    		$video_queue_manager = $this->get('ch212app.alesso.video_queue_manager');
    		$results             = $video_queue_manager->sendGeneratePreview($video);
    		
    		return new JsonResponse(array("message"=>"OK"), 200);
    	}
    	catch (\Exception $e)
    	{
    		switch($e->getCode())
    		{    			
    			case "0016":
    				return new JsonResponse(array("message" => "No video found! :".$getMessage(), "code" => $e->getCode()));
    				break;
    			default:
    				return new JsonResponse(array("message" => "Unknow error. Please notify developers: ".$e->getMessage(), "code" => $e->getCode()), 409);
    				break;
    		}	
    	}
    	return new JsonResponse(array("message"=>"Unknow error"), 403);
    }
    
   	/**
   	 * @Route("/user/video/preview/{token}")
     * @Method("GET")
     * 
     * 
   	 * @return \Symfony\Component\HttpFoundation\JsonResponse
   	 */
    public function getPreviewAction($token)
    {
    	$alessoService = $this->get('ch212app.alesso.service');
    	$logger = $this->get('logger');
    	try
    	{
    		$logger->info('Alesso Web Service GET Request /user/video/preview',array('token' => $token));
    		if ($alessoService->validateTokenVideoApprove($token) == false) return new JsonResponse(array("message" => "Invalid user token on confirm video", "code" => $e->getCode()), 400);
    		
    		$video   = $alessoService->getVideoFromTokenVideoApprove($token);
    		$paths   = $alessoService->getPreviewsURL($video->getId());
    		foreach($paths as $filter => $url)
    		{
    			if ($url == '') return new JsonResponse(array('status'=>'ko'), 200);
    		}   		
    		return new JsonResponse(array(
    				'status'=>'ok', 
    				'images' => array(
    						'italiano'    => $paths["italiano"],
    						'grid'        => $paths["waldengrid"],
    						'light_leaks' => $paths["lightleaks"],
    				)), 200);
    	}
    	catch (\Exception $e)
    	{
    		switch($e->getCode())
    		{
    			case "0016":
    				return new JsonResponse(array("message" => "No video found! :".$getMessage(), "code" => $e->getCode()), 403);
    				break;
    			default:
    			 	return new JsonResponse(array("message" => "Unknow error. Please notify developers: ".$e->getMessage(), "code" => $e->getCode()), 409);
    				break;
    		}	
    	}
    	return new JsonResponse(array("message"=>"Unknow error"), 403);
    }
    
    
    
    /**
     * @Route("/user/video/render/{token}")
     * @Method("POST")
     * {
     *   title:  "alesso  | 212", 
     *   filter: "italiano | grid | lightleak", 
     *   hotSpot: "ready", 
     *   confirm_token: "99&1816&327a0265cf548e09615491822765f8ab"}
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function renderVideoAction($token)
    {
    	$alessoService = $this->get('ch212app.alesso.service');
    	$logger        = $this->get('logger');
    	$request       = $this->getRequest();
    	
    	try
    	{
    		
    		if ($alessoService->validateTokenVideoApprove($token) == false) return new JsonResponse(array("message" => "Invalid user token on confirm video", "code" => $e->getCode()), 403);
    		$video = $alessoService->getVideoFromTokenVideoApprove($token);
    		$header       	     = $request->request->get('title');
    		$filter				 = $request->request->get('filter');

    		$logger->info('Alesso Web Service GET Request /user/video/preview',array('token' => $token));
    		if ($header == '' || $filter == '') return new JsonResponse(array("message"=> "No parameters found"), 400);
    		
    		$video_queue_manager = $this->get('ch212app.alesso.video_queue_manager');
    		$header_map = array(
    			'alesso' => 'header_a',
    			'212'	 => 'header_b'		
    		);
    		$filter_map = array(
    			'italiano'   => 'italiano',
    			'grid'	     => 'waldengrid',
    			'lightleaks' => 'lightleaks',
    		);

            # Generate the render if the args are valid
            if(array_key_exists($filter, $filter_map) && array_key_exists($header, $header_map)) {
    		    $results = $video_queue_manager->sendGenerateRender($video, $filter_map[$filter], $header_map[$header]);
                $response = new JsonResponse(array("message" => "OK"), 200);
            }
            else {
                $error = "Not valid args";
                $response = new JsonResponse(array("message" => "ERROR"), 400);
            }
    		return $response;
    	}
    	catch(\Exception $e)
    	{
    		switch($e->getCode())
    		{
    			case "1000":
    				return new JsonResponse(array("message" => "Filter not valid"), 400);
    				break;
    			default:
    				return new JsonResponse(array("message" => "Unknow error. Please notify developers: ".$e->getMessage(), "code" => $e->getCode()), 409);
    				break;
    		}
    	}
    	return new JsonResponse(array("message"=>"Unknow error"), 403);
    }
    
    /**
     * @Route("/user/video/render/{token}")
     * @Method("GET")
     * 
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function isVideoReadyAction($token)
    {
    	$alessoService = $this->get('ch212app.alesso.service');
    	$logger        = $this->get('logger');
    	try
    	{
    		if ($alessoService->validateTokenVideoApprove($token) == false) return new JsonResponse(array("message" => "Invalid user token on confirm video", "code" => $e->getCode()), 403);
    		$video   = $alessoService->getVideoFromTokenVideoApprove($token);
    		$results = $alessoService->getRenderedUrl($video->getId());
    		return new JsonResponse(array("status" => "ok", "url" => $results["render"]), 200);
    	}
    	catch(\Exception $e)
    	{
    		switch ($e->getCode())
    		{
    			case "0018":
    				return new JsonResponse(array("status" => "ko","message" => "Error on render video execution"), 503);
    				break;
    			case "0019":
    				return new JsonResponse(array("status" => "ko","message" => "Video not ready"), 503);
    				break;
    			default:
    				return new JsonResponse(array("status" => "ko", "message" => "Unknow error. Please notify developers: ".$e->getMessage(), "code" => $e->getCode()), 409);
    				break;
    		}
    	
    	}
    	
    	return new JsonResponse(array("message"=>"Unknow error"), 403);
    }
    
    /**
     * @Route("/log-action")
     * @Method("POST")
     *
     * Action, user_id, screen
     */
    public function logAction()
    {
    	$alessoService = $this->get('ch212app.alesso.service');
    	$logger        = $this->get('logger');
    	$request       = $this->getRequest();
    	$logger->info("CLIENT DOES: ", (array) $request->request);
    	return new JsonResponse(array(),200);
    }
}
