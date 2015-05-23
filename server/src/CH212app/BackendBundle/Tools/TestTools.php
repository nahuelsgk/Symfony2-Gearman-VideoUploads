<?php 
namespace CH212app\BackendBundle\Tools;

class TestTools
{
	public static function randomHotspot()
	{
		$hotspotArray = array('kiss','dance', 'ready','selfie');
		return $hotspotArray[rand()%4];
	}
		
	public static function buildRandomMailinator()
	{
		return substr(md5(rand()), 0, 10).'@mailinator.com';
	}
	
	public static function buildRandomEANCODE()
	{
		return substr(md5(rand()), 0, 13);
	}
	
	public static function buildRandomString()
	{
		return substr(md5(rand()), 0, 10);
	}
	
	public static function buildRandomZipcode()
	{
		return substr(md5(rand()), 0, 5);
	}
	
	/**
	 * TODO: return a real store number
	 * @return number
	 */
	public static function buildRandomStore()
	{
		return 18;	
	}
	
	
	public function login($client)
	{
		$crawler = $client->request('GET', '/login');
		$form = $crawler->selectButton('_submit')->form(array(
				'_username'  => 'nahuelsgk',
				'_password'  => 'nahuel123N',
		));
		$client->submit($form);
		 
		return $crawler;
	}
}
?>