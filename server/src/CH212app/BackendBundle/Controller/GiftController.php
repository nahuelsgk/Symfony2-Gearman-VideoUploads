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
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class GiftController extends Controller
{

	/**
	 * @Route("/admin/gift", name="_admin_list_gifts")
	 * @Template()
	 * @return multitype:unknown
	 */
	public function giftListAction()
	{
		$gifts = $this->getDoctrine()
		->getRepository('BackendBundle:Gift')
		->findAll();
	
		return array(
				'gifts' => $gifts
		);
	}
	
	/**
	 * @Route("/admin/gift/add", name="_admin_add_gift");
	 * @Template()
	 */
	public function giftAddAction(Request $request)
	{
		$gift = new Gift();
		$form = $this->createFormBuilder($gift)
		->add('country', 'country')
		->add('gift')
		->getForm();
	
		if ($request->getMethod() == 'POST')
		{
			$form->bind($request);
	
			if ($form->isValid())
			{
				$gift = $form->getData();
	
				//Search if the country already has a gift
				$em            = $this->getDoctrine()->getManager();
				$existing_gift = $em->getRepository('BackendBundle:Gift')->findByCountry($gift->getCountry());
				if (count($existing_gift) > 0) throw $this->createNotFoundException("This country already have a gift. Please delete before or edit it");
	
				//Add gift
				$em = $this->getDoctrine()->getManager();
				$gift->setActive(true);
				$em->persist($gift);
				$em->flush();
	
				return $this->redirect($this->generateUrl('_admin_list_gifts'));
			}
		}
		return array('form' => $form->createView());
	}
	
	/**
	 * @Route("/admin/gift/{gift_id}");
	 * @Template()
	 */
	public function giftEditAction($gift_id)
	{
		$eanCode = new Gift();
		$form = $this->createFormBuilder($gift)
		->add('');
	
		return array($this->$form->createView());
	
	}
	
	/**
	 * @Route("/admin/gift/{gift_id}/enable", name="_admin_gift_enable")
	 * @Template()
	 */
	public function giftEnableAction($gift_id)
	{
		$em    = $this->getDoctrine()->getManager();
		$gift  = $em->getRepository('BackendBundle:Gift')->find($gift_id);
	
		if (!$gift) throw $this->createNotFoundException("No gift found for id ".$id);
	
		$gift->setActive(true);
		$em->flush();
	
		//Redirigimos al refererer
		return $this->redirect($this->getRequest()->headers->get('referer'));
	}
	
	/**
	 * @Route("/admin/gift/{gift_id}/disable", name="_admin_gift_disable")
	 */
	public function giftDisableAction($gift_id)
	{
		$em    = $this->getDoctrine()->getManager();
		$gift = $em->getRepository('BackendBundle:Gift')->find($gift_id);
	
		if (!$gift) throw $this->createNotFoundException("No gift found for id ".$id);
	
		$gift->setActive(false);
		$em->flush();
	
		//Redirigimos al refererer
		return $this->redirect($this->getRequest()->headers->get('referer'));
	}
	
	/**
	 * @Route("/admin/gift/{gift_id}/remove", name="_admin_gift_remove")
	 */
	public function giftRemoveAction($gift_id)
	{
		$em    = $this->getDoctrine()->getManager();
		$gift = $em->getRepository('BackendBundle:Gift')->find($gift_id);
	
		if (!$gift) throw $this->createNotFoundException("No gift found for id ".$id);
	
		$em->remove($gift);
		$em->flush();
	
		//Redirigimos al refererer
		return $this->redirect($this->getRequest()->headers->get('referer'));
	}
}