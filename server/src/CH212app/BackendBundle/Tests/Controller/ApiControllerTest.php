<?php
namespace CH212app\BackendBundle\Tests\Controller;

use \Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use CH212app\BackendBundle\Tools\TestTools as TestTools;
use \Symfony\Component\HttpFoundation\File\UploadedFile;
use \Symfony\Component\HttpFoundation\File\MimeType\MimeTypeGuesser;

class ApiControllerTest extends WebTestCase
{
	/**
	 * @var \Doctrine\ORM\EntityManager
	 */
	private $_um;
	
	/**
	 * @var \Doctrine\ORM\EntityManager
	 */
	private $_em;
	
	/**
	 * @var \CH212app\BackendBundle\Service\AlessoServices.php
	 */
	private $_as;
	
	public function setUp()
	{
		$kernel = static::createKernel();
		$kernel->boot();
		$this->_um = $kernel->getContainer()->get('fos_user.user_manager');
		$this->_em = $kernel->getContainer()->get('doctrine.orm.entity_manager');
		$this->_as = $kernel->getContainer()->get('ch212app.alesso.service');
	}
	
	/**
	 * Simply test to login WS
	 */
	public function testLoginNoParameters()
	{
		$_GET['debug'] = 1;
		$client = static::createClient();
		$crawler = $client->request('PUT', '/api/user');
		$this->assertEquals(
				403,
				$client->getResponse()->getStatusCode()
		);
	}
	
	/**
	 * Test the simplest logic.
	 */
	public function testRegisterCountryWithoutGift()
	{
		$this->registerLogic(false);
	}
	
	public function testRegisterCountryWithGift()
	{
		$this->registerLogic(true);
	}
	
	public function testRegisterCountryWithGiftAndUploadVideo()
	{
		$this->registerLogic(true, true);
	}
	
	public function testVideoConfirmationInvalidParameter()
	{
		$client   = static::createClient();
		$crawler  = $client->request(
			'GET',
			'/api/user/TEST'
		);
		
		$this->assertEquals(
			400,
			$client->getResponse()->getStatusCode(),
			'The WS return an error'.$client->getResponse()->getContent()
		);
	}
	
	public function testLoginNoExistingUser()
	{
		$_GET['debug'] = 1;
		$client = static::createClient();
		$email = 'admin@admin.com';
		$crawler  = $client->request(
			'PUT',
			'/api/user',
			array(
				'email' => $email
			)
		); 
		
		$this->assertEquals(
			401,
			$client->getResponse()->getStatusCode(),
			'Unexisting user try to request a login'
		);
	}
	
	public function testLoginOnExistingUser()
	{
		$this->loginVideoLogic(false, false);
	}

	public function testLoginAndUploadVideoRandomHotSpot()
	{
		$this->loginVideoLogic(true, true);
	}
	
	public function testLoginAndUploadVideoRandomHotSpotWithConfirmation()
	{
		$this->loginVideoLogic(true, true, null, true);
	}
	
	public function testLoginAndUploadVideoKissHotSpot()
	{
		$this->loginVideoLogic(true, true, 'kiss');
	}
	
	public function testLoginAndUploadVideoDanceHotspot()
	{
		$this->loginVideoLogic(true, true, 'dance');
	}
	
	public function testLoginAndUploadVideoReadyHotspot()
	{
		$this->loginVideoLogic(true, true, 'ready');
	}
	
	public function testLoginAndUploadVideoSelfieHotspot()
	{
		$this->loginVideoLogic(true, true, 'selfie');
	}
	
	public function registerLogic($gift, $video = null, $confirm = null)
	{
		$user = $this->createRandomUser(false);
		$_GET['debug'] = 1;
		$client        = static::createClient();
		$crawler       = $client->request(
				'POST',
				'/api/user',
				array
				(
					'name'    => $user->getName(),
					'surname' => $user->getSurname(),
					'birth'   => '21-11-1980',
					'hotSpot' => $user->getHotSpot(),
					'email'   => $user->getEmail(),
					'zipcode' => $user->getZipcode(),
					'country' => $gift == true? 'MX' : 'ZM', 
					'store'	  => $gift == true? TestTools::buildRandomStore() : null,
					'eancode' => null,
					'locale'  => $user->getLocale(),									
				));
		$this->assertEquals(
			200,
			$client->getResponse()->getStatusCode(),
			'The Ws return an error'.$client->getResponse()->getContent()	
		);
		
		if ($gift == false)	
			echo "Please check that the correct email(No gift) was sent to ".$user->getEmail(). " with name ".$user->getName()."\r\n";
		else 
			echo "Please check that the correct email(With gift) was sent to ".$user->getEmail(). " with name ".$user->getName()."\r\n";
		
		if ($video)
		{
			$data = json_decode($client->getResponse()->getContent());
			$client = $this->uploadVideoFunctional($client, $data->id, null, $user->getEmail(), $confirm);		
			
		}
	}
	
	/*
	public function testLoginAndUploadVideoSelfieHotspot()
	{
		$this->loginVideoLogic(true, true, null, true);
	}
	*/
	
	/**
	 * Complete logic with parameters
	 * 
	 * @param boolean $video_logic: Test video logic
	 */
	private function loginVideoLogic($video_logic, $persist, $hotspot = null, $confirm = null)
	{
		//Create a User thru database
		$user = $this->createRandomUser(true);
		
		//Just request the login
		$_GET['debug'] = 1;
		$client        = static::createClient();
		$crawler       = $client->request('PUT','/api/user',array('email' => $user->getEmail()));
		
		//First check: the user must exists because is on the DB
		$this->assertEquals(
				200,
				$client->getResponse()->getStatusCode(),
				'The Ws has not fount the email of an existing user'
		);
		
		//Second check:the user must be the valid id
		$data = json_decode($client->getResponse()->getContent());
		$this->assertEquals(
			$this->_as->validateUserApiToken($data->id),
			true,
			"WS had return a wrong user id"
		);
		
		//Should be continue uploading a video
		if ($video_logic)
		{
			$this->uploadVideoFunctional($client, $user->getId(), $hotspot, $user->getEmail(), $confirm);
		}
		
		//Should be delete all data generated
		if ($persist == false) $this->deleteUser($user);
	}
	
	private function uploadVideoFunctional($client, $user_id, $hotspot, $email, $confirm)
	{
		$hotspot = $hotspot == null ? testTools::randomHotspot() : $hotspot;
		echo "* Testing upload video for $hotspot. Check ".$email."\r\n";
		$crawler  = $client->request(
				'POST',
				'/api/upload-video',
				array(
						'userId'  => $user_id,
						'hotSpot' => $hotspot
				),
				array(
						'file'   => $this->getFileFixture("test_video.mp4")
				)
		);
			
		//Check that the video was succesfully uploaded
		$this->assertEquals(
				200,
				$client->getResponse()->getStatusCode(),
				'The Ws return an error '.$client->getResponse()->getContent()
		);
			
		//Confirm the video
		if($confirm)
		{
			$response = json_decode($client->getResponse()->getContent());
			$client->request(
				'POST',
				'/api/user/confirm-video/'.$response->confirm_token
			);
			
			$this->assertEquals(
					200,
					$client->getResponse()->getStatusCode(),
					'The WS return an error: '.$client->getResponse()->getContent()
			);
			//@TODO: No sabemos que tiene hacer
		}
		
		return $client;
	}
	
	public function testAssignationFakeTokenUser()
	{
		$client = static::createClient();
		$crawler = $client->request('GET', '/api/user/TEST/audio');
		$data = $client->getResponse()->getContent();
		$this->assertEquals(
				403,
				$client->getResponse()->getStatusCode(),
				"Failed to assert fake user: ".$client->getResponse()->getContent()
		);
		$this->assertEquals(
				"Invalid User Token from audio assignation",
				json_decode($data)->message,
				"Failed to assert fake user: ".$client->getResponse()->getContent()
		);
		
		
	}
	
	public function testAssignationRegisterAndAskToken()
	{
		//Create a User thru database
		$user = $this->createRandomUser(true);
		
		//Just request the login
		$_GET['debug'] = 1;
		$client        = static::createClient();
		$crawler       = $client->request('PUT','/api/user',array('email' => $user->getEmail()));
		
		//First check: the user must exists because is on the DB
		$this->assertEquals(
				200,
				$client->getResponse()->getStatusCode(),
				'The Ws has not fount the email of an existing user'
		);
		
		//Second check:the user must be the valid id
		$data = json_decode($client->getResponse()->getContent());
		$this->assertEquals(
				$this->_as->validateUserApiToken($data->id),
				true,
				"WS had return a wrong user id"
		);
		
		$data = json_decode($client->getResponse()->getContent());
		//Lets assign a code to the user
		var_dump($data->id);
		$crawler  = $client->request(
				'GET',
				'/api/user/'.$data->id.'/audio'
		);
		
		$data = json_decode($client->getResponse()->getContent());
		
		//Fourth check: If there are codes shoud be ok 
		$this->assertEquals(
				200,
				$client->getResponse()->getStatusCode(),
				"Code assigned: ".$client->getResponse()->getContent().". WARNING: if this fail may be aren't more audio download codes to assign "
		);
		
		$this->deleteUser($user);
	}
	
	/**
	 * Get all particpations WS.
	 */
	public function testGetAllParticipations()
	{
		$client = static::createClient();
		$crawler  = $client->request(
				'GET',
				'/api/participations/0'
		);
		
		$this->assertEquals(
				200,
				$client->getResponse()->getStatusCode(),
				'Unexisting web service'
		);
	}
	
	/**
	 * Get file fixture as UploadedFile
	 * @param string $filename
	 * @return \Symfony\Component\HttpFoundation\File\UploadedFile
	 */
	private function getFileFixture($filename)
	{
		$filepath     = getcwd() . DIRECTORY_SEPARATOR . $filename;
		$filepath_tmp = getcwd() . DIRECTORY_SEPARATOR . "tmp_".$filename;
		copy($filepath, $filepath_tmp);
		return new UploadedFile(
				$filepath_tmp,
				$filename,
				MimeTypeGuesser::getInstance()->guess($filepath),
				filesize($filepath)
		);
	}
	
	/**
	 * Helper to create a user
	 * 
	 * @param boolean $persist: Persist on Database
	 * 
	 * @return User
	 */
	private function createRandomuser($persist)
	{
		$user = $this->_um->createUser();
		$user->setName(TestTools::buildRandomString());
		$user->setSurname(TestTools::buildRandomString());
		$user->setDateBirth(new \DateTime('21-11-1980'));
		$user->setHotSpot(TestTools::randomHotspot());
		$user->setEmail(TestTools::buildRandomMailinator());
		$user->setZipCode(TestTools::buildRandomZipcode());
		$user->setCountry('MX');
		$currentTime = new \Datetime();
		$currentTime = $currentTime->format('Y-F-d-h-i-s');
		//Becareful those line!!! We have to abstractit maybe
		$user->setUsername($user->getName().$user->getSurname().$currentTime);
		$user->setPassword(md5($user->getName().$user->getSurname()."private_hash"));
		//Becareful those line!!! We have to abstractit maybe
		$user->addRole('ROLE_USER');
		$user->setLocale('en');
		$user->setAudioEmailSent(false);
		
		if ($persist) $this->_um->updateUser($user);
		return $user;
	}
	
	private function deleteUser($user)
	{
		$this->_em->remove($user);
		$this->_em->flush();
	}
	
}