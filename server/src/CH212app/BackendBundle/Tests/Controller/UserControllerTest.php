<?php
namespace CH212app\BackendBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use CH212app\BackendBundle\Tools\TestTools as TestTools;

class UserControllerTest extends WebTestCase
{
	/**
	 * The use case must for the admin controller:
	 * - User must fulfill the post parameters:
	 * * Email
	 * * Returns an Exception with code 0000
	 */

	/**
	 * @var \Doctrine\ORM\EntityManager
	 */
	private $_em;
	
	public function setUp()
	{
		$kernel = static::createKernel();
		$kernel->boot();
		$this->_em = $kernel->getContainer()
		->get('doctrine.orm.entity_manager');
	}
	
	
	public function testUserCreateWithOutEanCodeNoPersitation()
	{
		$this->UserCreate(false, false);
	}
	
	public function testUserCreateWithEanCodeNoPersitation()
	{
		$this->UserCreate(true, false);
	}
	
	public function testUserCreateWithOutEanCodePersisting()
	{	
		$this->UserCreate(false, true);
	}
	
	public function testUserCreateWithEanCodePersisting()
	{
		$this->UserCreate(true, true);
	}
	
	/**
	 * Create a user from the admin backend test. Must receive a greatings email.
	 */
	private function UserCreate($eancode, $persist)
	{
		$client = static::createClient();
		
		/* Login to the backend */
		$crawler = $client->request('GET', '/login');
   		$form = $crawler->selectButton('_submit')->form(array(
     		'_username'  => 'nahuelsgk',
		    '_password'  => 'nahuel123N',
   		));
   		$client->submit($form);
   		
   		/* TODO: Assert that goes to home */
   		$this->assertTrue(
   			$client->getResponse()->isRedirect('http://localhost/admin/new-videos')
   		);
   		
   		$crawler = $client->followRedirect();
   		
   		$email_id = TestTools::buildRandomMailinator();
   		
   		echo "** Testing for this email: ".$email_id."\r\n";
   		
   		//foreach(array('kiss','dance', 'ready','selfie') as $hotspot)
   		//{
   			$hotspot = TestTools::randomHotspot();
			/* Create a new user */
			$crawler = $client->request('GET', '/admin/user/new');
			$this->assertEquals(200, 
					$client->getResponse()->getStatusCode(), 
					"Unexpected HTTP status code for GET '/admin/user/new");
			
			$buttonCrawlerNode = $crawler->selectButton('submit');
			
			$form = $this->buildForm($buttonCrawlerNode, $email_id, $hotspot, $eancode);
			$result = $client->submit($form);
			$crawler = $client->followRedirect();
			
			/* Check if the user is correct */
			$this->assertGreaterThan(0, $crawler->filter('[value="'.$email_id.'"]')->count(), 'Missing element [value="'.$email_id.'"]');
			
			/* Check the email sent */
			echo "** Please check that a thanks to registering on $hotspot email was sent to :".$email_id."\r\n";
			
			/* Delete User */
			if ($persist == false){
		        $user = $this->_em->getRepository('BackendBundle:User')->findOneBy(array('email' => $email_id));
		        $this->_em->remove($user);
		        $this->_em->flush();
			}
   		//}
	}
	
	
	private function buildForm($buttonCrawlerNode, $email_id, $hotspot, $eancode){
		$buildForm = array(
				'form[name]' 	   		 => 'Testing Name',
				'form[surname]'    		 => 'Testing Surname',
				'form[email]'      		 => $email_id,
				'form[hotspot]'    		 => $hotspot,
				'form[zipcode]'     	 => '08020',
				'form[dateBirth][day]'   => '11',
				'form[dateBirth][month]' => '11',
				'form[dateBirth][year]'  => '2012',
				'form[country]'	   		 => 'ES',
				'form[locale]'	   		 => 'en'
		);
		if ($eancode != false) $buildForm['form[eancode]'] = TestTools::buildRandomEANCODE(); 
		return $buttonCrawlerNode->form($buildForm);
	}
	
}