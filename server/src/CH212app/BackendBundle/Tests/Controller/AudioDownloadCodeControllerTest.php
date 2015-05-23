<?php

namespace CH212app\BackendBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use CH212app\BackendBundle\Tools\TestTools as TestTools;

class AudioDownloadCodeControllerTest extends WebTestCase
{

	
	public function testAssignAudioDownloadCode()
	{
		$client = static::createClient();
		
		TestTools::login($client);
		
		$crawler = $client->request('GET', '/admin/audiodownloadcode/assign');
		
		$this->assertEquals(200, $client->getResponse()->getStatusCode(), "Unexpected HTTP status code for GET /admin/audiodownloadcode/".$client->getResponse()->getContent());
		
		$form = $crawler->selectButton('Assign')->form();
		
		//Select randomly one unse
		$random_user_position  = (rand(0 , count($form['form[users]']->availableOptionValues())-1));
		$form['form[users]']->select($form['form[users]']->availableOptionValues()[$random_user_position]);
		
		$client->submit($form);
		//Becareful if do not redirect. thers no more audio
		$crawler = $client->followRedirect();
		
	}
	
    public function testCompleteScenario()
    {
        // Create a new client to browse the application
        $client = static::createClient();
		
        TestTools::login($client);
        
        // Create a new entry in the database
        $crawler = $client->request('GET', '/admin/audiodownloadcode/');
        $this->assertEquals(200, $client->getResponse()->getStatusCode(), "Unexpected HTTP status code for GET /admin/audiodownloadcode/");
        
        $crawler = $client->click($crawler->selectLink('Create a new entry')->link());

        // Fill in the form and submit it
        $form = $crawler->selectButton('Create')->form(array(
            'ch212app_backendbundle_audiodownloadcodetype[code]'  => 'Test',
        ));
        $client->submit($form);
        
        //Becareful if do not redirect. maybe test failed and left "Test" code in DB because couldnt delete it
        $crawler = $client->followRedirect();

        // Check data in the show view
        $this->assertGreaterThan(0, $crawler->filter('td:contains("Test")')->count(), 'Missing element td:contains("Test")');

        // Edit the entity
        $crawler = $client->click($crawler->selectLink('Edit')->link());

        $form = $crawler->selectButton('Edit')->form(array(
            'ch212app_backendbundle_audiodownloadcodetype[code]'  => 'Foo',
        ));

        $client->submit($form);
        $crawler = $client->followRedirect();

        // Check the element contains an attribute with value equals "Foo"
        $this->assertGreaterThan(0, $crawler->filter('[value="Foo"]')->count(), 'Missing element [value="Foo"]');

        // Delete the entity
        $client->submit($crawler->selectButton('Delete')->form());
        $crawler = $client->followRedirect();

        // Check the entity has been delete on the list
        $this->assertNotRegExp('/Foo/', $client->getResponse()->getContent());
    }

}