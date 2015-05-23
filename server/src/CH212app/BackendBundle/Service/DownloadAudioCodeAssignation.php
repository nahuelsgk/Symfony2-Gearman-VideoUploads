<?php 
namespace CH212app\BackendBundle\Service;

use Doctrine\ORM\EntityManager;

class DownloadAudioCodeAssignation
{
	/**
	 * Exceptions
	 * 0006 No user with this id
	 * 1001 No more available codes    
	 */
	
	/**
	 * @var EntityManager
	 */
	protected $em;

	public function __construct(EntityManager $em)
	{
		$this->em = $em;
	} 
	
	public function assign($user_id)
	{
		$user = $this->em->getRepository('BackendBundle:User')->findOneBy(array('id'=> $user_id));
		
		if (!$user || $user == null ) throw new \Exception("No user with this id: ".$user_id, "0006");
		
		if ($user->getAudiodownloadcode() != null ) return $user->getAudiodownloadcode();
		
		$code = $this->isAnyAvailableCode();
		
		$code->setUser($user);
		$this->em->flush();
		return $code;
	}
	
	public function isAnyAvailableCode()
	{
		$audioCodeDownload = $this->em->getRepository('BackendBundle:AudioDownloadCode')->findOneBy(array('user' => null));
		//\Doctrine\Common\Util\Debug::Dump($audioCodeDownload);
		if ($audioCodeDownload == null) throw new \Exception("No available codes", "1001");
		return $audioCodeDownload;
	}
}

?>