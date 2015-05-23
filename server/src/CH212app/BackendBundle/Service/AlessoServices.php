<?php
namespace CH212app\BackendBundle\Service;

use Symfony\Component\HttpKernel\Log\LoggerInterface as LoggerInterface;
use CH212app\BackendBundle\Entity\EANCodeUsed as EANCodeUsed;
use Symfony\Component\Translation\Translator as Translator;
use Ivory\GoogleMap\Services\Geocoding\Geocoder as Geocoder;
use Symfony\Bundle\FrameworkBundle\Routing\Router as Router;
use Fos\UserBundle\Model\UserManager as UserManager;
use CH212app\BackendBundle\Entity\Video as Video;
use CH212app\BackendBundle\Entity\User as User;
use CH212app\BackendBundle\Entity\User as Store;
use Doctrine\ORM\EntityManager;
use Mandrill as Mandrill;


class AlessoServices
{

	/**
	 * Exceptions:
	 * 0000 You say already registered and you don\'t exist!
	 * 0001 You\'re EANCode Is Used
	 * 0002 No stores found for this country
	 * 0003 You say you are not already registered and there's a user with that email
	 * 0004 This country has no gifts
	 * 0005 No stores found for this country
	 * 0006 No user with this id
	 * 0007 No hotspot found for this email
	 * 0008 User send thanks sending mail failed
	 * 0009 No user with this email
	 * 0010 For sending an email to give thanks to a user, we need video_id and hotspot. This is because we need to build confirm link for a video.
	 * 0011 Sending email with hotspot that not exits
	 * 0012 Configuration App was no correct. Max downloads audio or audio counter was not find
	 * 0013 User $user_id is not the owner of the video $video_id
	 * 0014 Unknow error
	 * 0015 Invalid confirmation token
	 * 0016 No video found
	 * 0017 Empty path for preview images
	 * 0018 Error video execution
	 */

	/**
	 * @var EntityManager
	 */
	protected $em;

	/**
	 * @var Geocoder
	 */
	protected $geocoder;

	/**
	 * @var UserManager
	 */
	protected $um;

	/**
	 * @var Router
	 */
	protected $router;

	/**
	 * @var Translator
	 */
	protected $translator;

	/**
	 * @var Logger
	 */
	protected $logger;

	/**
	 *
	 * @var String
	 */
	protected $public_app_url;

	public function __construct(EntityManager $em, Geocoder $geocoder, UserManager $um, Router $router, Translator $translator, LoggerInterface $logger, $public_app_url)
	{
		//print_r(func_get_args());exit;
		$this->em             = $em;
		$this->geocoder       = $geocoder;
		$this->um		      = $um;
		$this->router	      = $router;
		$this->translator     = $translator;
		$this->logger	      = $logger;
		$this->public_app_url = $public_app_url;
	}

	/**
	 * @param integer $user_id
	 * @param Symfony\Component\HttpFoundation\File\UploadedFile $uploadedFile
	 * @param string $ip
	 * @param integer $hotspot
	 * @throws \Exception
	 * @return \CH212app\BackendBundle\Entity\Video
	 */
	public function uploadVideoFromUserInHotSpot($user_id, $uploadedFile, $ip, $hotspot)
	{

		$user = $this->um->findUserBy(array('id' => $user_id));

		if (!$user || $user == null ) throw new \Exception("No user with this id: ".$user_id, "0006");

		$video = new Video();
		$video->setUser($user);
		$video->setFile($uploadedFile);
		$video->setOriginalName($uploadedFile->getClientOriginalName());
		$video->setMimeType($uploadedFile->getMimeType());
		$video->setExtension($uploadedFile->guessExtension());
		$video->setStatus(Video::STATUS_NEW);
		$video->setIp($ip);
		$video->setCreated(new \DateTime());
		$video->setHotspot($hotspot);
		$video->setConfirmedByUser(false);
		$video->setFake(false);
		$this->em->persist($video);
		$this->em->flush();

//		Commented by changed logic
// 		$this->userSendEmail(
// 			$user->getEmail(),
// 			$user->getName(),
// 			$user->getLocale(),
// 			'participate',
// 			$hotspot,
// 			$video->getId(),
// 			false,
// 			null
// 		);


		//Also returns the token to confirm, may be in the future is useful
		$video->confirm_token = $this->buildTokenVideoApprove($user_id, $video->getId());

		return $video;
	}

	/**
	 * Logic to login a user. Manage EANCodes
	 *
	 * @param string $email
	 * @param string $eanCode optional
	 * @throws \Exception
	 * @return CH212app\BackendBundle\Entity\User
	 */
	public function userLogin($email, $eanCodeString = null)
	{
		$user = $this->um->findUserByEmail($email);

		if ($user == null)
			throw new \Exception(':-( You say already registered and you don\'t exist!', '0000');

		if($eanCodeString)
		{
			//Browse all the eancodes that user used
			$eancodesUsed = $user->getEanCodesUsed();
			foreach($eancodesUsed as $index => $eancodeUsed)
			{
				if ($eanCodeString === $eancodeUsed->getCodeUsed())
					throw new \Exception(':-( You\'re EANCode Is Used', '0001');
			}

			$eancode = new EANCodeUsed();
			$eancode->setCodeUsed($eanCodeString);
			$eancode->setUser($user);
			$user->addEanCodesUsed($eancode);
			$this->um->updateUser($user);
		}

		return 	$user;
	}


	/**
	 * Logic to create a user. Also send a welcome email.
	 *
	 * @param string $email
	 * @param string $name
	 * @param string $surname
	 * @param Date $dateBirth
	 * @param string $hotSpot
	 * @param string $zipcode
	 * @param string $country
	 * @param string $eancode_string
	 * @param integer $store_id
	 * @param string $locale
	 * @throws \Exception
	 * @return User
	 */
	public function userCreate($email, $name, $surname, $dateBirth, $hotSpot, $zipcode, $country, $eancode_string, $store_id, $locale, $ip)
	{
		$user = $this->um->findUserByEmail($email);
		if ($user != null)
			throw new \Exception(":-( You say you are not already registered and there's a user with that email", "0003");

		//if user is null(not exits) return an error
		$user = $this->um->createUser();
		$user->setName($name);
		$user->setSurname($surname);
		$user->setDateBirth($dateBirth);
		$user->setHotSpot($hotSpot);
		$user->setIp($ip);

		//Optional
		$store = new Store();
		if ($store_id != "" )
		{
			$store = $this->em->getRepository('BackendBundle:Store')->find($store_id);
			$user->setStore($store);
		}
		$user->setEmail($email);
		$user->setZipCode($zipcode);

		//Country trick to avoid country table
		$user->setCountry($country);
		//Translate countries to english
		$countries = \Symfony\Component\Locale\Locale::getDisplayCountries('en');
		$country_index = array_key_exists(strtoupper($country), $countries) == true ? strtoupper($country) : 'ES' ;
		$user->setCountrylong($countries[$country_index]);
		//End country trick

		$currentTime = new \Datetime();
		$currentTime = $currentTime->format('Y-F-d-h-i-s');
		$user->setUsername($name.$surname.$currentTime);
		$user->setPassword(md5($name.$surname."private_hash"));
		$user->addRole('ROLE_USER');
		$user->setLocale($locale);
		$user->setAudioEmailSent(false);
		$user->setCreated(new \Datetime('now'));

		//Attach eancode if necessary...
		if($eancode_string)
		{
			//Note: NOT Need to check if the eancode is used, because the only way to arrive this point
			//it's not to be registered
			$eancode = new EANCodeUsed();
			$eancode->setCodeUsed($eancode_string);
			$eancode->setUser($user);
			$user->addEanCodesUsed($eancode);
		}
		$this->em->getConnection()->beginTransaction();
		try{
			$this->um->updateUser($user);

			$lang   = $user->getLocale();
			$name   = $user->getName();
			$email  = $user->getEmail();
			$result = $this->userSendEmail(
					$email,
					$name,
					$lang,
					'thanks_registering',
					null,
					null,
					false,
					$store_id,
					$eancode_string);

			/*DEPRECATED: CAmbios en la logica incial
			if ($this->shouldWeSendAudio($user, $eancode_string))
			{
				$result_download_audio_email = $this->userSendEmail(
					$email,
					$name,
					$lang,
					'download_audio',
					null,
					null,
					false,
					null
				);

				$this->updateAudioEmailSendData($user);
			}*/
			$this->em->flush();
			$this->em->getConnection()->commit();
		}
		catch (\Exception $e)
		{
			$this->em->getConnection()->rollback();
			throw new \Exception("User send thanks sending mail failed:".$e->getMessage(), "0008");
		}
		return $user;
	}

	/**
	 * Function to update data after email audio download send:
	 *
	 * - Mark the user
	 * - Check the user
	 *
	 * @param User $user
	 *
	 * @return boolean
	 */
	public function updateAudioEmailSendData($user)
	{
		$user->setAudioEmailSent(true);
		$configuration     = $this->em->getRepository('BackendBundle:CampaignConfiguration');
		$counter_downloads = $configuration->findOneBy(array('name' => 'counter_download'));
		$current_counter   = $counter_downloads->getValue();
		$counter_downloads->setValue($current_counter++);

		return true;
	}

	/**
	 * This function validate the conditions to send audio download email.
	 * Conditions:
	 * - Email download was already sent
	 * - Still we have free downloads
	 * - Used a EANCode
	 *
	 * @param User $user
	 * @return boolean
	 */
	private function shouldWeSendAudio($user, $eancode)
	{
		if ( $eancode == '' || $eancode == null) return false;

		if ($user == null) throw new \Exception('No user with this id', '0006');

		$configuration     = $this->em->getRepository('BackendBundle:CampaignConfiguration');
		$max_downloads     = $configuration->findBy(array('name' => 'max_download'));
		$counter_downloads = $configuration->findBy(array('name' => 'counter_download'));

		if($max_downloads == null || $counter_downloads == null)
			throw new \Exception('Configuration App was no correct. Max downloads audio or audio counter was not find', '0012');

		$alreadySent = $user->getAudioEmailSent();
		return ($max_downloads <= $counter_downloads) && (!$alreadySent);
	}

	/**
	 *
	 * @return boolean
	 */
	public function userIsOneOfTheFirstNRegister($user_id)
	{
		return true;
	}

	/**
	 * Returns an array with basic info for stores, order by distance from a zipcode and a country.
	 *
	 * @param string $zipcode
	 * @param string $country
	 * @param integer $radius
	 * @throws \Exception:
	 *  - if the country has no gitfs
	 *  - if the country has no active stores
	 * @return number|multitype:
	 */
	public function getClosestStores($zipcode, $country, $radius)
	{
		//Search the gifts for the given country
		$gifts = $this->em->getRepository('BackendBundle:Gift')->findBy(
				array(
						'country' => $country,
						'active'  => true
				)
		);

		if (count($gifts) == 0 )
			throw new \Exception(":-( This country has no gifts.", "0001");

		//Second we search if we have a store in that country
		$stores = $this->em->getRepository('BackendBundle:Store')->findBy(
				array(
						'country' => $country,
						'active'  => true
				));

		if (count($stores) == 0 )
			throw new \Exception(":-( No stores found for this country ".$country, "0002");

		//@TODO: Search for the postcode belongs to the country requested

		$stores_with_distances = array();
		$geocoder       = $this->geocoder;
		$address_string = $zipcode.', '.$country;

		$results = $geocoder->geocode($address_string)->getResults();
		$result  = $results[0];

		$location_origin = $result->getGeometry()->getLocation();
		$latitude_origin = $location_origin->getLatitude();
		$longitud_origin = $location_origin->getLongitude();

		//Lets build an array with distances from origin requested(zipcode + country)
		foreach ($stores as $index=>$store){
			$store_representation = new \StdClass();
			//First we calculate the distance from the position request to the store...
			$latitude_destination = $store->getLatitude();
			$longitud_destination = $store->getLongitud();
			$distance = $this->distance($latitude_origin, $longitud_origin, $latitude_destination, $longitud_destination, "K");
			$store_representation->id       = $store->getId();
			$store_representation->name		= $store->getName();
			$store_representation->postcode = $store->getZipcode();
			$store_representation->address  = $store->getAddress();
			$store_representation->distance = floatval($distance);
			//Only push if
			if ($radius == ''  ||
					$radius == "0" ||
					($store_representation->distance < $radius && $radius != '' && $radius != '0'))
						array_push($stores_with_distances, $store_representation);

		}
		//...and lets sort it by the distance calculated
		usort($stores_with_distances, function ($a, $b){
			//La funcion de comparacion ha de devolver un entero
			//Si no hacemos esto, -0.5 se evalua como 0
			$diff = $a->distance - $b->distance;
			if ($diff < 0) return -1;
			else return 1;
		});

		return $stores_with_distances;
	}

	/**
	 * Private function to calculate a distance between two geoposition

	 * @param float $lat1
	 * @param float $lon1
	 * @param float $lat2
	 * @param float $lon2
	 * @param float $unit
	 * @return number
	 */
	private function distance($lat1, $lon1, $lat2, $lon2, $unit)
	{

		$theta = $lon1 - $lon2;
		$dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
		$dist = acos($dist);
		$dist = rad2deg($dist);
		$miles = $dist * 60 * 1.1515;
		$unit = strtoupper($unit);
		if ($unit == "K")
		{
			return ($miles * 1.609344);
		}
		else if ($unit == "N")
		{
			return ($miles * 0.8684);
		}
		else
		{
			return $miles;
		}
	}

	/**
	 * Helper to build the content for the welcome(1st email(thanks for registering)) email
	 *
	 * @return multitype:multitype:string  multitype:string NULL
	 */
	private function buildSendThanksForResgisteringEmailContent($lang, $name, $email, $store_id, $eancode, $test)
	{
		$subject				 = $this->translator->trans('hello_user', array('user_name' => $name), 'messages', $lang);
		$thanks_for_registering  = $this->translator->trans('thanks_for_registering', array(), 'messages', $lang);

		$by_registering_you_get  = $this->translator->trans('by_registering_you_get', array(), 'messages', $lang);
		$unsuscribe_disclaimer	 = $this->translator->trans('disclaimer_mails', array('unsuscribe_link'=>$this->router->generate('_public_user_unsuscribe', array('user_token' => 'aaaa', 'lang' => 'en'), true),), 'messages', $lang);

		/*
		* Mandrill array-like to pass the dynamic content to the
		* Must build and array of array: stylish:
		* array(
		* 	array(
		*     'name'    => Name of the mandrill parameter on the template
		*     'content' => Content for the paramente
		*   )
		* )
		*/
		$template_content = array();

		/*
		 * For mandrill tags
		 * Must be an array(
		 *   'tag_name' => Content for that tag
		 * )
		 */
		$template_tags['image_url_header'] = "http://www.carolinaherrera.com/212/vipclubedition/mails/registering.jpg";

		$template_content[] = array(
						'name'    => 'title_header_email',
						'content' => $thanks_for_registering
		);

		$user = new User();
		//For testing purposes
		if (!$test)
		{
			$user = $this->um->findUserByEmail($email);
			if(count($user) == 0) throw new \Exception("No user with this email", "0009");
		}


		$publicUrlBuilder = new URLPublicBuilder($this->public_app_url);

		//CASE E01: With store=>with gift, no eancodes
		if ($store_id != null && $store_id != '' && $eancode == null)
		{
			$template_content[] = array(
					'name'    => 'generic_message_1',
					'content' => $this->translator->trans('you_are_one_step_closer_by_registering_gift', array(), 'messages', $lang)
			);

			$template_content[] = array(
					'name' 	  => 'listen_to_alesso',
					'content' => $this->translator->trans('listen_to_alesso', array(), 'messages', $lang)
			);

			$template_content[] = array(
					'name'    => 'present_this_voucher',
					'content' => $this->translator->trans('present_this_voucher', array() ,'messages', $lang)
			);
			$template_content[] = array(
					'name'    => 'gift_disclaimer',
					'content' => $this->translator->trans('gift_disclaimer', array() ,'messages', $lang)
			);

			//Get store name
			$store      = $this->em->getRepository('BackendBundle:Store')->find($store_id);
			$store_name = $store->getName();

			$template_tags['store_link'] = "http://maps.google.com/maps?q=".$store->getLatitude().",".$store->getLongitud();
			$template_tags['store_name'] = $store->getName();

 			/*$template_content[] = array(
					'name'    => 'generic_action_link_title',
					'content' => $this->translator->trans('download_voucher', array(), 'messages', $lang)
			);*/

			//For mandrill tags
			$template_tags['action_link_image'] = $this->translator->trans('participate_img_button', array(), 'messages', $lang);
			$template_tags['action_link']       = $publicUrlBuilder->buildMainUrl();
			$ending_content = $this->translator->trans('be_part_of_the_perfect_song', array(), 'messages', $lang);
		}

		//CASE E03: With store=>with gift, with eancodes: the more complex one: E02+E01
		elseif($eancode != null && $eancode != '' && $store_id != null && $store_id != '')
		{
			$template_tags['image_url_header'] = "http://www.carolinaherrera.com/212/vipclubedition/mails/registeringEANCODE_OK.jpg";

			$template_content[] = array(
				'name'    => 'generic_message_1',
				'content' => $this->translator->trans('you_are_one_step_ibiza', array('participate_url' => $publicUrlBuilder->buildMainUrl()), 'messages', $lang)
			);

			$template_content[] = array(
				'name'    => 'generic_message_2',
				'content' => $this->translator->trans('also_by_registering', array(), 'messages', $lang)
			);

			$template_content[] = array(
					'name' 	  => 'listen_to_alesso',
					'content' => $this->translator->trans('listen_to_alesso', array(), 'messages', $lang)
			);

			$template_content[] = array(
					'name'    => 'present_this_voucher',
					'content' => $this->translator->trans('present_this_voucher', array() ,'messages', $lang)
			);

			//Get store name
			$store      = $this->em->getRepository('BackendBundle:Store')->find($store_id);
			$store_name = $store->getName();

			$template_tags['store_link'] = "http://maps.google.com/maps?q=".$store->getLatitude().",".$store->getLongitud();
			$template_tags['store_name'] = $store->getName();

			$ending_content 					= $this->translator->trans('join_us_in_the_first_collaborative', array(), 'messages', $lang);
			$template_tags['action_link_image'] = $this->translator->trans('participate_now_img_button', array(), 'messages', $lang);
			$template_tags['action_link']       = $publicUrlBuilder->buildMainUrl($lang);
		}

		//CASE E02: With Eancode, no store
		elseif($eancode != null && $eancode != '' && $store_id == null)
		{
			$template_tags['image_url_header'] = "http://www.carolinaherrera.com/212/vipclubedition/mails/registeringEANCODE_OK.jpg";

			$template_content[] = array(
				'name'    => 'generic_message_1',
				'content' => $this->translator->trans('you_are_one_step_ibiza', array(), 'messages', $lang)
			);
			$template_tags['action_link_image'] = $this->translator->trans('participate_now_img_button', array(), 'messages', $lang);
			$template_tags['action_link'] 		= $publicUrlBuilder->buildMainUrl();
			$ending_content						= $this->translator->trans('join_us_in_the_first_collaborative', array(), 'messages', $lang);
		}

		//CASE E00: No store, no eancode
		else
		{
			$template_content[] = array(
					'name'    => 'generic_message_1',
					'content' => $this->translator->trans('you_are_one_step_closer', array(), 'messages', $lang)
			);

			$template_tags['action_link_image'] = $this->translator->trans('participate_img_button', array(), 'messages', $lang);
			$template_tags['action_link'] 		= $publicUrlBuilder->buildMainUrl();
			$ending_content						= $this->translator->trans('be_part_of_the_perfect_song', array(), 'messages', $lang);
		}

		$template_content[] = array(
			'name'    => 'generic_ending_content',
			'content' => $ending_content,
		);


		return array(
				'data'    		  => $template_content,
				'tags'    		  => $template_tags,
				'subject' 		  => $subject,
		);
	}

	/**
	 *
	 * @param unknown $lang
	 * @param unknown $name
	 * @param unknown $email
	 * @param unknown $eancode
	 * @param unknown $test
	 * @return multitype:NULL unknown multitype:multitype:string unknown
	 */
	private function buildSendDownloadAudioOnlyContent($lang, $name, $email, $eancode, $test)
	{
		$subject = $this->translator->trans('user_this_is_for_you', array('user_name' => $name), 'messages', $lang);

		$thanks_for_participating 			= $this->translator->trans('thanks_for_participating', array(), 'messages', $lang);
		$you_are_one_step_closer_with_audio = $this->translator->trans('you_are_one_step_closer_with_audio', array(), 'messages', $lang);
		$unsuscribe_disclaimer	  			= $this->translator->trans('disclaimer_mails', array(), 'messages', $lang);
		$join_us_in_the_first_collaborative = $this->translator->trans('join_us_in_the_first_collaborative', array(), 'messages', $lang);

		$template_content = array();

		$template_content[] = array(
						'name'    => 'title_header_email',
						'content' => $thanks_for_participating
		);

		$template_content[] = array(
				'name'    => 'generic_message_1',
				'content' => $you_are_one_step_closer_with_audio
		);

		$template_content[] = array(
						'name'    => 'unsuscribe_disclaimer',
						'content' => $unsuscribe_disclaimer
		);

		return array(
				'data'            => $template_content,
				'subject'         => $subject,
				'unsuscribe_link' => $this->router->generate('_public_user_unsuscribe', array('user_token' => 'aaaa', 'lang' => 'en'), true)
		);
	}

	/**
	 * Helper to build the content for the participation with a video.
	 * Note: Email id: E10
	 * Note: All $hotspot has been commented because a change of logic: 30/4/2015
	 * Note: 2xoptim change logic 29th/4/2015
	 *
	 * @param string $lang: Required: Select languages strings
	 * @param string $hotSpot: Required: Which hotspot we must select for the content
	 *
	 * @return multitype:multitype:string  multitype:string NULL
	 */
	private function buildParticipateThanksEmailContent($lang, $name, $hotspot, $email, $video_id, $test)
	{
		//if ( !in_array($hotspot,array('kiss', 'dance','ready', 'selfie')) ) throw new \Exception("No hotspot found for this email", "0007");

		$user = new User();
		if (!$test)
		{
			$user = $this->um->findUserByEmail($email);
			if(count($user) == 0) throw new \Exception("No user with this email", "0009");
		}

		$subject               = $this->translator->trans('your_video_is_in_the_cast', array('user_name' => $name), 'messages', $lang);

		$template_content = array();

// 		$wow_thats_great_hs = '';
// 		switch($hotspot)
// 		{
// 			case "kiss":
// 				$wow_thats_great_hs                = $this->translator->trans('wow_great_kiss', array(), 'messages', $lang);
// 				$template_tags['image_url_header'] = "http://test.linkemann.net/212vip/mails/kiss.jpg";
// 				break;

// 			case "dance":
// 				$wow_thats_great_hs                = $this->translator->trans('wow_great_dance', array(), 'messages', $lang);
// 				$template_tags['image_url_header'] = "http://test.linkemann.net/212vip/mails/dance.jpg";
// 				break;

// 			case "ready":
// 				$wow_thats_great_hs                = $this->translator->trans('wow_great_ready', array(), 'messages', $lang);
// 				$template_tags['image_url_header'] = "http://test.linkemann.net/212vip/mails/get-ready.jpg";
// 				break;

// 			case "selfie":
// 				$wow_thats_great_hs                = $this->translator->trans('wow_great_selfie', array(), 'messages', $lang);
// 				$template_tags['image_url_header'] = "http://test.linkemann.net/212vip/mails/selfie.jpg";
// 				break;

// 			default:
// 				throw new \Exception("Sending email with hotspot that not exits.", "0011");
// 				break;
// 		}


		$template_tags['image_url_header'] = "http://www.carolinaherrera.com/212/vipclubedition/mails/participate.jpg";

		//Mandrill array-like to pass the dynamic content to the
		$template_content[] = array(
			'name'    => 'title_header_email',
			'content' => $this->translator->trans('your_video_is_in', array(), 'messages', $lang)
		);

		$publicUrlBuilder = new URLPublicBuilder($this->public_app_url);
		$template_content[] = array(
			'name'	  => 'generic_message_1',
			'content' => $this->translator->trans('you_can_see_your_participation', array(
					'participants_url' => $publicUrlBuilder->buildEqualizerUrl(),
					'participate_url'  => $publicUrlBuilder->buildParticipantsGallery(),
			), 'messages', $lang)
		);

		$template_content[] = array(
				'name'    => 'generic_ending_content',
				'content' => $this->translator->trans('lets_the_show_begin', array(), 'messages', $lang)
		);

		$template_content[] = array(
			'name'	  => 'generic_action_link_title',
			'content' => $this->translator->trans('confirm', array(), 'messages', $lang)
		);

		//For mandrill tags: 2xoptim
		//
		// 		$template_tags['action_link']	   = 'http://http://212vip.loc/'.$this->buildUrlConfirmactionVideoByUser(
		// 					$test ? '1' : $user->getId(),
		// 					$video_id,
		// 					false);


		$template_tags['action_link_image'] = $this->translator->trans('participate_again', array(), 'messages', $lang);
		$template_tags['action_link'] 		= $publicUrlBuilder->buildMainUrl();

		return array(
				'data'            => $template_content,
				'tags'            => $template_tags,
				'subject'         => $subject,
				//'unsuscribe_link' => $this->router->generate('_public_user_unsuscribe', array('user_token' => 'aaaa', 'lang' => 'en'), true)
		);
	}

	/**
	 * Helper to build the content for the thanks for participating email after a video has been aproved
	 *
	 * @param string $lang: Required: Select languages strings
	 *
	 * @return multitype:multitype:string  multitype:string NULL
	 */
	private function buildApprovedVideoEmailContent($lang, $video_id, $test)
	{
		$user = new User();
		if (!$test)
		{
			$user = $this->um->findUserByEmail($email);
			if(count($user) == 0) throw new \Exception("No user with this email", "0009");
		}

		$title_header_email       = $this->translator->trans('thanks_for_participating', array(), 'messages', $lang);
		$unsuscribe_disclaimer	  = $this->translator->trans('disclaimer_mails', array(), 'messages', $lang);

		$thanks_for_registering_content = $title_header_email;
		$email_content    				= $this->translator->trans('thanks_for_participate');

		//Mandrill array-like to pass the dynamic content to the
		$template_content = array(
				array(
						'name'    => 'title_header_email',
						'content' => $title_header_email
				),
				array(
						'name'	  => 'generic_message_1',
						'content' => $this->translator->trans('we_will_let_you', array(), 'messages', $lang)
				),
				array(
						'name'	  => 'generic_message_2',
						'content' => $this->translator->trans('have_a_look', array(), 'messages', $lang)
				),
				array(
						'name'	  => 'generic_action_link_title',
						'content' => $this->translator->trans('watch_now', array(), 'messages', $lang)
				),
				array(
						'name'    => 'unsuscribe_disclaimer',
						'content' => $unsuscribe_disclaimer
				),
		);

		//For mandrill tags
		$template_tags = array(
				'image_url_header' => "http://www.carolinaherrera.com/212/vipclubedition/mails/alesso-1.png",
				'action_link'	   => 'http://test.link.com'
		);

		return array(
				'data'            => $template_content,
				'tags'            => $template_tags,
				'subject'         => $title_header_email,
				'unsuscribe_link' => $this->router->generate('_public_user_unsuscribe', array('user_token' => 'aaaa', 'lang' => 'en'), true)
		);
	}


    /**
     * Helper to build the content to indicate that the video is ready
     *
     * @param string $lang: Required: Select languages strings
     *
     * @return multitype:multitype:string  multitype:string NULL
     */
    private function buildIsReadyVideoEmailContent($lang, $hotspot, $name, $email, $video_id, $test)
    {
        $user = new User();
        if (!$test)
        {
            $user = $this->um->findUserByEmail($email);
            if(count($user) == 0) throw new \Exception("No user with this email", "0009");
        }

        $title_header_email       = $this->translator->trans('video_ready_title', array(), 'messages', $lang);
        $unsuscribe_disclaimer    = $this->translator->trans('disclaimer_mails', array(), 'messages', $lang);

        $email_content                  = $this->translator->trans('video_ready_email_content');
        $subject               = $this->translator->trans('video_ready_subject', array('user_name' => $name), 'messages', $lang);

        //Mandrill array-like to pass the dynamic content to the
        //TODO complete mandril fields
        $template_content = array(
                array(
                        'name'    => 'title_header_email',
                        'content' => $title_header_email
                ),
                array(
                        'name'    => 'generic_message_1',
                        'content' => $this->translator->trans('video_ready_content_line1', array(), 'messages', $lang)
                ),
                array(
                        'name'    => 'generic_message_2',
                        'content' => $this->translator->trans('video_ready_content_line2', array(), 'messages', $lang)
                ),
                array(
                        'name'    => 'generic_ending_content',
                        'content' => $this->translator->trans('video_ready_bottom_line', array(), 'messages', $lang)
                ),
                array(
                        'name'    => 'generic_action_link_title',
                        'content' => $this->translator->trans('watch_now', array(), 'messages', $lang)
                ),
                array(
                        'name'    => 'unsuscribe_disclaimer',
                        'content' => $unsuscribe_disclaimer
                ),
        );

        $confirm_token    = $this->buildTokenVideoApprove($user->getId(), $video_id);
        $publicUrlBuilder = new URLPublicBuilder($this->public_app_url);
        $url_video_link   = $publicUrlBuilder->buildMyVideoURL($hotspot, $confirm_token);
        
        //For mandrill tags
        $template_tags = array(
                'image_url_header' => "http://www.carolinaherrera.com/212/vipclubedition/mails/reward.jpg",
                'action_link'      => $url_video_link,
                'action_link_image' => $this->translator->trans('video_ready_action_link_image', array(), 'messages', $lang)
        );

        return array(
                'data'            => $template_content,
                'tags'            => $template_tags,
                'subject'         => $subject,
                'unsuscribe_link' => $this->router->generate('_public_user_unsuscribe', array('user_token' => 'aaaa', 'lang' => 'en'), true)
        );
    }

	/**
	 *
	 * @param string $email: User'semail
	 * @param string $name: User's name
	 * @param string $lang: Language for the email content
	 * @param string $type: Can be "thanks", "participate", "approved_video": Type of email to send
	 * @param string hotspot: Optional: Can be: 'kiss', 'dance', 'ready', 'selfie'. Required for "participate": type;
	 * @param int $video_id: Optional: user_id. To build a confirmation link. Required for "participate" type;
	 * @param int $test: Optional: to validate some requeriments. If true, those requirements are not tested.
	 * @param int $store_id: Optional: store_id to send to the user store information
	 * @param string $eancode: Optional: eancode, just to control the type of emails
	 * @throws Mandrill_Error
	 */
	public function userSendEmail($email, $name, $lang, $type, $hotspot = null, $video_id = null, $test=false, $store_id = null, $eancode = null)
	{
		$result = array();
		$user      = $this->um->findUserByEmail($email);

		if (!$test){
			if ($user == null) throw new \Exception('No user with this email', '0009');

			//Logic hack by new logic on 7th april
			if ($user->getUnsuscribe() != null)
			{
				return $result = array('The user was unsusucribed on '.$user->getUnsuscribe()->format('m-d-Y'));
			}
		}
		try
		{
			//$mandrill       = new Mandrill('2BkZKBpv1Jo5XoXUkUHebg');
			$mandrill       = new Mandrill('O_0LTSTDJC5J6B4aZuMAPQ');
			$template_name  = 'basic_212_vip_template';

			$template_content = array();

			switch ($type){
				case "thanks_registering":
					$template_content = $this->buildSendThanksForResgisteringEmailContent($lang, $name, $email, $store_id, $eancode, $test);
					break;

				case "login":
					$template_content = $this->buildSendDownloadAudioOnlyContent($lang, $name, $email, $eancode, $test);
					break;

				case "participate":
					if(	($video_id == null || $hotspot == null) && !$test) throw new \Exception("For sending an email to give thanks to a user, we need video_id and hotspot. This is because we need to build confirm link for a video.");
					$template_content = $this->buildParticipateThanksEmailContent($lang, $name, $hotspot, $email, $video_id, $test);
					break;

				case "approved_video":
					if ( $video_id == null && !$test) throw new \Exception("For sending an email to notify the user that the video has been approved, we need the video_id.");
					$template_content = $this->buildApprovedVideoEmailContent($lang, $hotspot, $email, $video_id, $test);
					break;

                case "video_ready":
					if ( $video_id == null && !$test) throw new \Exception("For sending an email to notify that the video is ready, we need the video_id.");
					$template_content = $this->buildIsReadyVideoEmailContent($lang, $hotspot, $name, $email, $video_id, $test);
					break;

				default:
					throw new \Exception("Trying to send and email type that not exits. Type passed: ".$type);
					break;
			}


			//Generic unsuscriber
			$urlPublicBuilder           = new URLPublicBuilder($this->public_app_url);
			//$unsuscribe_disclaimer      = array('name' => 'unsuscribe_disclaimer', 'content' => $this->translator->trans('disclaimer_mails', array('unsuscribe_link'=>$urlPublicBuilder->buildMainUrl()), 'messages', $lang));

			$user_id   = $test == true ?   1 : $user->getId();
			$url_unsus = $this->router->generate('_public_user_unsuscribe', array('user_token'=>$this->buildUserApiToken($user_id)), true);
			$unsuscribe_disclaimer      = array('name' => 'unsuscribe_disclaimer', 'content' => $this->translator->trans('disclaimer_mails',
										array('unsuscribe_link'=>$url_unsus),
										'messages', $lang));
			$template_content["data"][] = $unsuscribe_disclaimer;

			//'unsuscribe_disclaimer' =>
			$message = array(
					'html'       => null,
					'text'       => null,
					'subject' 	 => $template_content['subject'],
					'from_email' => '212@puig.es',
					'from_name'  => '212VIP - Carolina Herrera',
					'to'         => array(
							array(
									'email' => $email,
									'name'  => $name,
									'type' => 'to')),
					'headers' 	  => array('Reply-To' => '212@puig.es'),
					'important'   => false,
					'track_opens' => null,
					'track_clicks' => null,
					'auto_text' => null,
					'auto_html' => null,
					'inline_css' => null,
					'url_strip_qs' => null,
					'preserve_recipients' => null,
					'view_content_link' => null,
					'bcc_address' => false,
					'tracking_domain' => null,
					'signing_domain' => null,
					'return_path_domain' => null,
					'merge' => true,
					'merge_language' => 'mailchimp',
					'global_merge_vars' => array(
							array(
									'name' => 'merge1',
									'content' => 'merge1 content'
							)
					),
					'merge_vars' => array(
							array(
									'rcpt' => $email,
									'vars' => array(
											array(
													'name'    => 'image_url_header',
													'content' => isset($template_content['tags']['image_url_header']) ? $template_content['tags']['image_url_header'] : ''
											),
											array(
													'name'    => 'action_link',
													'content' => isset($template_content['tags']['action_link']) ? $template_content['tags']['action_link'] : ''
											),
											array(
													'name'    => 'action_link_image',
													'content' => isset($template_content['tags']['action_link_image']) ? $template_content['tags']['action_link_image'] : ''
											),
											array(
													'name'    => 'unsuscribe_link',
													'content' => isset($template_content['unsuscribe_link']) ? $template_content['unsuscribe_link'] : ''
											),
											array(
													'name'    => 'store_link',
													'content' => isset($template_content['tags']['store_link']) ? $template_content['tags']['store_link'] : ''
											),
											array(
													'name'    => 'store_name',
													'content' => isset($template_content['tags']['store_name']) ? $template_content['tags']['store_name'] : ''
											),
									)
							)
					),
					'tags' => null,
					'subaccount' => null,
					'google_analytics_domains' => null,
					'google_analytics_campaign' => null,
					'metadata' => null,
					'recipient_metadata' => null,
					'attachments' => null,
					'images' => null);
			$async   = false;
			$ip_pool = null;
			$send_at = null;
			$result  = $mandrill->messages->sendTemplate(
					$template_name,
					$template_content['data'],
					$message,
					$async,
					$ip_pool,
					$send_at);
			$this->logger->info("Alesso Service Email Sent", array('email' => $email, 'name' => $name, '$lang' => $lang, 'type' => $type, 'hotspot' => $hotspot, 'video_id' => $video_id, 'test' => $test, 'store_id' => $store_id, 'eancode' => $eancode));
		}
		catch (Mandrill_Error $e)
		{
			// Mandrill errors are thrown as exceptions
			//echo 'A mandrill error occurred: '.get_class($e).' - '.$e->getMessage();
			// A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
			throw $e;
		}
		return $result;
	}

	/**
	 * Private function to validate token for the user and video
	 *
	 * @param string $token
	 * @param integer $user_id
	 * @param integer $video_id
	 * @return boolean
	 */
	public function validateToken($token, $user_id, $video_id)
	{
		if ( $token == $this->buildTokenConfirmVideo($user_id, $video_id)) return true;
		return false;
	}

	/**
	 * Private function to make the token
	 *
	 * @param int $user_id
	 * @param int $video_id
	 */
	private function buildTokenConfirmVideo($user_id, $video_id){
		$composed_id = $user_id . '_'.  $video_id;
		return md5( $composed_id."secret" );
	}


	/** VIDEO TOKEN BLOCK***/

	/**
	 * Private function to build confirmation-video-url-by-user
	 *
	 * @param integer $user_id
	 * @param integer $video_id
	 * @param string $absolute
	 * @return string
	 */
	public function buildUrlConfirmactionVideoByUser($user_id, $video_id, $absolute=true){

		$token = $this->buildTokenConfirmVideo($user_id, $video_id);
		$url = $this->router->generate(
				'_public_approve_video_by_user',
				array(
					'approve_video_token' => $this->buildTokenVideoApprove($user_id, $video_id)
				),
				false
		);
		$absolute_url = 'http://212vip.loc#confirm/'.$this->buildTokenVideoApprove($user_id, $video_id);
		return $absolute == true ? $absolute_url : $url;
	}

	/**
	 * Build a token for the confirmation video
	 *
	 * @param unknown $user_id
	 * @return string
	 */
	private function buildTokenVideoApprove($user_id, $video_id)
	{
		return $user_id.'&'.$video_id.'&'.md5($user_id.$video_id.'secret_tokenizer');
	}

	/**
	 * Validates the user token from the confirmation video. Trim the user token
	 * @param unknown $token
	 */
	public function validateTokenVideoApprove($token)
	{
		$token_exploded = explode("&",$token);

		if (count($token_exploded) != 3) return false;

		elseif ($token == $this->buildTokenVideoApprove($token_exploded[0], $token_exploded[1]) )return true;

		return false;
	}

	private function getUserFromTokenVideoApprove($token)
	{
		$token_exploded = explode("&",$token);
		$user = $this->um->findUserBy(array('id' => $token_exploded[0]));
		if (!$user || $user == null ) throw new \Exception("No user with this id: ".$user_id, "0006");
		return $user;
	}

	public function getVideoFromTokenVideoApprove($token)
	{
		$token_exploded = explode("&",$token);
		$video = $this->em->getRepository('BackendBundle:Video')->find($token_exploded[1]);

		if (!$video) throw new Exception("No video found for id ".$video_id, "0016");

		return $video;
	}

	/**
	 * Function that confirms a video user. This sends to the video process queue
	 *
	 * Note: DEPRECATED function beacause logic changed
	 *
	 * @param integer $user_id
	 * @param integer $video_id
	 * @param integer $token
	 * @throws \Exception
	 *
	 * @return boolean
	 */
	public function confirmUserVideo($token)
	{

		if ($this->validateTokenVideoApprove($token) == false) throw new \Exception("Invalid confirmation token", "0015");

		$video = $this->getVideoFromTokenVideoApprove($token);
		$user  = $this->getUserFromTokenVideoApprove($token);

		//Check if the user is the owner of the video
		if ($user->getId() == $video->getUser()->getId())
		{
			$video->setConfirmedByUser(true);
			$this->em->flush();
			return $user;

		}
		else throw new \Exception("User $user_id is not the owner of the video $video_id",  "0013" );

		return false;
	}

	/**
	 * Function that confirms a video user. Just simply sends an email
	 *
	 * @param integer $token: Token for video and user
	 * @throws \Exception
	 *
	 * @return boolean
	 */
	public function sendConfirmationUserVideo($token)
	{

		if ($this->validateTokenVideoApprove($token) == false) throw new \Exception("Invalid confirmation token", "0015");

		$video = $this->getVideoFromTokenVideoApprove($token);
		$user  = $this->getUserFromTokenVideoApprove($token);

		//Check if the user is the owner of the video
		if ($user->getId() == $video->getUser()->getId())
		{
			$this->userSendEmail(
					$user->getEmail(),
					$user->getName(),
					$user->getLocale(),
					'participate',
					$video->getHotspot(),
					$video->getId(),
					false,
					null,
					null
			);
			return $user;

		}
		else throw new \Exception("User $user_id is not the owner of the video $video_id",  "0013" );

		return false;
	}

	/** USER API BLOCK **/
	public function buildUserApiToken($user_id){
		return $user_id."-".md5($user_id."secret_api_token");
	}

	public function validateUserApiToken($userApiToken)
	{
		$string_exploded = explode('-', $userApiToken);
		if ($userApiToken == $this->buildUserApiToken($string_exploded[0])) return true;
		return false;
	}
	public function getUserIdFromUserApiToken($userApiToken)
	{
		$string_exploded = explode('-', $userApiToken);
		return $string_exploded[0];
	}

	/*** PREVIEW IMAGES ***/

	/**
	 * Builds public preview images
	 * @param string $path
	 */
	public function buildURLPreviewImage($path)
	{
        $url_preview_image = '';
        if ($path != null && $path != '') {
            $publicUrlBuilder  = new URLPublicBuilder($this->public_app_url);;
            $url_preview_image = $publicUrlBuilder->buildPreviewImage($path);
        }
		return $url_preview_image;
	}

    /**
     * Build a url for a rendered video
	 * @param integer $video_id
     *
	 * @throws \Exception
     */
	public function getRenderedUrl($video_id)
	{
		$video = $this->em->getRepository('BackendBundle:Video')->findOneBy(array('id' =>$video_id));
		if ($video == null) throw new \Exception("No video found", "0016");

		$path = $video->getRender();
		if (substr($path, 0, 5) == "ERROR") throw new \Exception("Video error execution", "0018");
		if ($path == '' || $path == null) throw new \Exception("Video not ready", "0019");
		
        return array(
            "render" => $this->buildURLPreviewImage($video->getRender())
        );
	}

	/**
	 *
	 * Builds an array of all public previews images
	 * @param integer $video_id
	 *
	 * @throws \Exception
	 *
	 * @return multitype:array
	 */
	public function getPreviewsURL($video_id)
	{
		$video = $this->em->getRepository('BackendBundle:Video')->findOneBy(array('id' =>$video_id));
		if ($video == null) throw new \Exception("No video found", "0016");

		$preview_paths = array(
				"italiano"   => $this->buildURLPreviewImage($video->getPreviewItaliano()),
				"waldengrid" => $this->buildURLPreviewImage($video->getPreviewWaldengrid()),
				"lightleaks" => $this->buildURLPreviewImage($video->getPreviewLightleaks()),
		);
		return $preview_paths;
	}
}
