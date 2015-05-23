<?php

namespace CH212app\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use CH212app\BackendBundle\Entity\AudioDownloadCode;
use CH212app\BackendBundle\Form\AudioDownloadCodeType;
use Symfony\Component\HttpFoundation\Response;

/**
 * AudioDownloadCode controller.
 *
 * @Route("/admin/audiodownloadcode")
 */
class AudioDownloadCodeController extends Controller
{
    /**
     * Lists all AudioDownloadCode entities.
     *
     * @Route("/", name="admin_audiodownloadcode")
     * @Method("GET")
     * @Template()
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('BackendBundle:AudioDownloadCode')->findBy(array(), array('id' => 'DESC'));

        $paginator = $this->get('knp_paginator');
        $pagination = $paginator->paginate(
        		$entities,
        		$request->query->get('page',1),
        		5
        );
        
        return array(
        	'pagination' => $pagination
        );
    }

    /**
     * Creates a new AudioDownloadCode entity.
     *
     * @Route("/", name="admin_audiodownloadcode_create")
     * @Method("POST")
     * @Template("BackendBundle:AudioDownloadCode:new.html.twig")
     */
    public function createAction(Request $request)
    {
        $entity  = new AudioDownloadCode();
        $form = $this->createForm(new AudioDownloadCodeType(), $entity);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('admin_audiodownloadcode_show', array('id' => $entity->getId())));
        }

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Displays a form to create a new AudioDownloadCode entity.
     *
     * @Route("/new", name="admin_audiodownloadcode_new")
     * @Method("GET")
     * @Template()
     */
    public function newAction()
    {
        $entity = new AudioDownloadCode();
        $form   = $this->createForm(new AudioDownloadCodeType(), $entity);

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * @Route("/import", name="_admin_downloadcode_import")
     * @Template()
     * @Method({"GET", "POST"})
     * @param Request $request
     *
     */
    public function importAction(Request $request)
    {
    	$form = $this->createFormBuilder()
    	->add('csvfile', 'file', array(
    			'label'  => 'CSV to upload',
    			'mapped' => false,
    	))
    	->getForm();
    	
    	$log_raw      = array();
    	$n_codes      = 0;
    	$n_duplicated = 0;
    	if ($request->getMethod() == 'POST')
    	{
    		$form->bind($request);
    		if ($form->isValid()) 
    		{
    			$em       = $this->getDoctrine()->getManager();
    			$codes    = $em->getRepository('BackendBundle:AudioDownloadCode')->findAll();
    			
    			//To avoid duplications insert
    			$project_codes = array_reduce(
    				$codes,
					function(&$result, $code){ 
						$result[$code->getCode()] = $code->getCode();
        				return $result;
    				}
				);
    			
    			
    			$csv_file = $request->files->get('form')['csvfile'];
    			$resource = fopen($csv_file->getPathname(), 'r');
    			
    			while(($csv_content = fgetcsv($resource, 0, ';', '"')) !== FALSE)
    			{
    				$code         = $csv_content[0]; //First column expected: download code
    				
    				if (array_key_exists($code, (array) $project_codes) == false)
    				{
    					$downloadCode = new AudioDownloadCode();
    					$downloadCode->setCode($code);
    					$em->persist($downloadCode);
    					
    					//Maximum 100 rows of logs...
    					if ($n_codes < 100) $log_raw[] = " * Audio Download Code inserted: $code";
    					
    					$n_codes++;
    					
    				}
    				else 
    				{
    					$log_raw[] = "* Duplicated code $code";
    					$n_duplicated++;
    				}
    			}
    			fclose($resource);
    			try {
    				$em->flush();
				} 
				catch (\PDOException $e) {
    				// ... Error on database call
				}
    		}
    		$log_raw[] = "Status: inserted $n_codes";
    		$log_raw[] = "Status: duplicated $n_duplicated";
    	}
    	
    	if ($n_codes >= 100) $log_raw[] = " * More logs... avoid to display them.";
    	
    	return array(
    		'form' => $form->createView(),
    		'log'  => $log_raw
    	);
    }
    
    /**
     * @Route("/assign", name="_admin_assign_audio_code")
     * @Template()
     * @Method({"GET", "POST"}) 
     */
    public function assignCodeAction(Request $request)
    {
    	$form = $this->createFormBuilder()
    	->add('users', 'entity', array(
    		'class'    => 'BackendBundle:User',
    		'property' => 'username'
    	))->getForm();
    	
    	if ($request->getMethod() == 'POST')
    	{
    		$form->bind($request);
    		if ($form->isValid())
    		{
    			$form    = $form->getData();
    			$user_id = $form['users']->getId();
    			try{
    				$audio_assignation_service = $this->get('ch212app.alesso.assign_audio_code');
    				$code = $audio_assignation_service->assign($user_id);
    			}
    			catch(\Exception $e)
    			{
    				switch($e->getCode())
    				{
    					case "1002":
    						return new Response("This user already has an audio code", 409); 
    						break;
    				}
    				throw $this->createNotFoundException("Unknow problem. Please notify developers: ".$e->getMessage());
    			}
    		    return $this->redirect($this->generateUrl('admin_audiodownloadcode_show', array('id' => $code->getId())));
    		}
    	}
    	return array('form' => $form->createView());
    }
    
    /**
     * Finds and displays a AudioDownloadCode entity.
     *
     * @Route("/{id}", name="admin_audiodownloadcode_show")
     * @Method("GET")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('BackendBundle:AudioDownloadCode')->find($id);
        
        if (!$entity) {
            throw $this->createNotFoundException('Unable to find AudioDownloadCode entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing AudioDownloadCode entity.
     *
     * @Route("/{id}/edit", name="admin_audiodownloadcode_edit")
     * @Method("GET")
     * @Template()
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('BackendBundle:AudioDownloadCode')->find($id);
		
		
        if (!$entity) {
            throw $this->createNotFoundException('Unable to find AudioDownloadCode entity.');
        }

        $editForm   = $this->createForm(new AudioDownloadCodeType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing AudioDownloadCode entity.
     *
     * @Route("/{id}", name="admin_audiodownloadcode_update")
     * @Method("POST")
     * @Template("BackendBundle:AudioDownloadCode:edit.html.twig")
     */
    public function updateAction(Request $request, $id)
    { 
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('BackendBundle:AudioDownloadCode')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find AudioDownloadCode entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new AudioDownloadCodeType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('admin_audiodownloadcode_edit', array('id' => $id)));
        }

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a AudioDownloadCode entity.
     *
     * @Route("/delete/{id}", name="admin_audiodownloadcode_delete")
     * @Method("POST")
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('BackendBundle:AudioDownloadCode')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find AudioDownloadCode entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('admin_audiodownloadcode'));
    }

    /**
     * Creates a form to delete a AudioDownloadCode entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
    
   
}
