<?php 
namespace CH212app\BackendBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use CH212app\BackendBundle\Entity\User;
use CH212app\BackendBundle\Entity\Video;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class LoadFakeParticipations implements FixtureInterface
{
	private $names = array(
			'Allison',
			'Arthur',
			'Ana',
			'Alex',
			'Arlene',
			'Alberto',
			'Barry',
			'Bertha',
			'Bill',
			'Bonnie',
			'Bret',
			'Beryl',
			'Chantal',
			'Cristobal',
			'Claudette',
			'Charley',
			'Cindy',
			'Chris',
			'Dean',
			'Dolly',
			'Danny',
			'Danielle',
			'Dennis',
			'Debby',
			'Erin',
			'Edouard',
			'Erika',
			'Earl',
			'Emily',
			'Ernesto',
			'Felix',
			'Fay',
			'Fabian',
			'Frances',
			'Franklin',
			'Florence',
			'Gabielle',
			'Gustav',
			'Grace',
			'Gaston',
			'Gert',
			'Gordon',
			'Humberto',
			'Hanna',
			'Henri',
			'Hermine',
			'Harvey',
			'Helene',
			'Iris',
			'Isidore',
			'Isabel',
			'Ivan',
			'Irene',
			'Isaac',
			'Jerry',
			'Josephine',
			'Juan',
			'Jeanne',
			'Jose',
			'Joyce',
			'Karen',
			'Kyle',
			'Kate',
			'Karl',
			'Katrina',
			'Kirk',
			'Lorenzo',
			'Lili',
			'Larry',
			'Lisa',
			'Lee',
			'Leslie',
			'Michelle',
			'Marco',
			'Mindy',
			'Maria',
			'Michael',
			'Noel',
			'Nana',
			'Nicholas',
			'Nicole',
			'Nate',
			'Nadine',
			'Olga',
			'Omar',
			'Odette',
			'Otto',
			'Ophelia',
			'Oscar',
			'Pablo',
			'Paloma',
			'Peter',
			'Paula',
			'Philippe',
			'Patty',
			'Rebekah',
			'Rene',
			'Rose',
			'Richard',
			'Rita',
			'Rafael',
			'Sebastien',
			'Sally',
			'Sam',
			'Shary',
			'Stan',
			'Sandy',
			'Tanya',
			'Teddy',
			'Teresa',
			'Tomas',
			'Tammy',
			'Tony',
			'Van',
			'Vicky',
			'Victor',
			'Virginie',
			'Vince',
			'Valerie',
			'Wendy',
			'Wilfred',
			'Wanda',
			'Walter',
			'Wilma',
			'William',
			'Kumiko',
			'Aki',
			'Miharu',
			'Chiaki',
			'Michiyo',
			'Itoe',
			'Nanaho',
			'Reina',
			'Emi',
			'Yumi',
			'Ayumi',
			'Kaori',
			'Sayuri',
			'Rie',
			'Miyuki',
			'Hitomi',
			'Naoko',
			'Miwa',
			'Etsuko',
			'Akane',
			'Kazuko',
			'Miyako',
			'Youko',
			'Sachiko',
			'Mieko',
			'Toshie',
			'Junko');
	
	private $last_names = array(
			'Abbott',
			'Acevedo',
			'Acosta',
			'Adams',
			'Adkins',
			'Aguilar',
			'Aguirre',
			'Albert',
			'Alexander',
			'Alford',
			'Allen',
			'Allison',
			'Alston',
			'Alvarado',
			'Alvarez',
			'Anderson',
			'Andrews',
			'Anthony',
			'Armstrong',
			'Arnold',
			'Ashley',
			'Atkins',
			'Atkinson',
			'Austin',
			'Avery',
			'Avila',
			'Ayala',
			'Ayers',
			'Bailey',
			'Baird',
			'Baker',
			'Baldwin',
			'Ball',
			'Ballard',
			'Banks',
			'Barber',
			'Barker',
			'Barlow',
			'Barnes',
			'Barnett',
			'Barr',
			'Barrera',
			'Barrett',
			'Barron',
			'Barry',
			'Bartlett',
			'Barton',
			'Bass');
	
	/**
	 * {@inheritDoc}
	 */
	public function load(ObjectManager $manager)
	{
		for($i=0; $i<10; $i++)
		{
			echo "Inserting user $i\r\n";
			$user  = $this->createUser();
			$video = $this->createVideo($user);
			
			try{
				$manager->persist($user);
				$manager->persist($video);
				$manager->flush();
			}
			catch(Exception $e)
			{
				echo "Error on insert";
				$manager->merge($user);
				$manager->merge($video);
				$manager->flush();
			}
		}
	}
	
	private function createUser()
	{
		$user    = new User();
		$name    = $this->names[rand()%151];
		$surname = $this->last_names[rand()%47];
		
		$user->setName($name);
		$user->setSurname($surname);
		$random_email = md5(rand());
		$user->setEmail($random_email.'@mailinator.com');
		$user->setDateBirth(new \Datetime('11-07-1980'));
		$user->setHotSpot('dance');
		$user->setPassword(md5($name.$surname."private_hash"));
		
		$countries = \Symfony\Component\Locale\Locale::getDisplayCountries('en');
		$random_country = array_rand($countries);
		$user->setCountry($random_country);
		$country_index = rand()%50;
		$user->setCountrylong($countries[$random_country]);
		$user->addRole('ROLE_USER');
		$user->setLocale('en');
		$user->setAudioEmailSent(false);
		
		//Fake and mandatory fos.user.bundle
		$currentTime = new \Datetime();
		$currentTime = $currentTime->format('Y-F-d-h-i-s');
		$user->setUsername($name.$surname.$currentTime);
		$user->setPassword(md5($name.$surname."private_hash"));
		return $user;		
	}
	
	private function createVideo($user)
	{
		$filepath     = dirname(__FILE__).DIRECTORY_SEPARATOR.'test_video.mp4';
		$filepath_tmp = dirname(__FILE__).DIRECTORY_SEPARATOR.'test_video_tmp.mp4';
		copy($filepath, $filepath_tmp);
		$uploadedFile = new UploadedFile($filepath_tmp, 'test_video_tmp.mp4', null, null, null, true);
		$video = new Video();
		$video->setUser($user);
		$video->setFile($uploadedFile);
		$video->setOriginalName($uploadedFile->getClientOriginalName());
		$video->setMimeType($uploadedFile->getMimeType());
		$video->setExtension($uploadedFile->guessExtension());
		$video->setStatus(Video::STATUS_NEW);
		$video->setIp('fake');
		$video->setCreated(\DateTime::createFromFormat('Y-m-d','2015-05-04'));
		$video->setHotspot('ready');
		$video->setConfirmedByUser(false);
		return $video;
	}
}
?>
