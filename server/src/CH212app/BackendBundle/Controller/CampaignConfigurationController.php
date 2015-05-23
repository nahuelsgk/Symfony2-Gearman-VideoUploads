<?php

namespace CH212app\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use CH212app\BackendBundle\Entity\CampaignConfiguration;
use CH212app\BackendBundle\Form\CampaignConfigurationType;

/**
 * CampaignConfiguration controller.
 *
 * @Route("/admin")
 */
class CampaignConfigurationController extends Controller
{
    /**
     * Lists all CampaignConfiguration entities.
     *
     * @Route("/config", name="_admin_config_list")
     * @Method("GET")
     * @Template()
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('BackendBundle:CampaignConfiguration')->findAll();

        return array(
            'entities' => $entities,
        );
    }

    /**
     * Creates a new CampaignConfiguration entity.
     *
     * @Route("/config/new", name="_admin_config_create")
     * @Method("POST")
     * @Template("BackendBundle:CampaignConfiguration:new.html.twig")
     */
    public function createAction(Request $request)
    {
        $entity  = new CampaignConfiguration();
        $form = $this->createForm(new CampaignConfigurationType(), $entity);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('_admin_config_show', array('id' => $entity->getId())));
        }

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Displays a form to create a new CampaignConfiguration entity.
     *
     * @Route("/config/new", name="_admin_config_new")
     * @Method("GET")
     * @Template()
     */
    public function newAction()
    {
        $entity = new CampaignConfiguration();
        $form   = $this->createForm(new CampaignConfigurationType(), $entity);

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Finds and displays a CampaignConfiguration entity.
     *
     * @Route("/config/{id}", name="_admin_config_show")
     * @Method("GET")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('BackendBundle:CampaignConfiguration')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find CampaignConfiguration entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing CampaignConfiguration entity.
     *
     * @Route("/config/{id}/edit", name="_admin_config_edit")
     * @Method("GET")
     * @Template()
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('BackendBundle:CampaignConfiguration')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find CampaignConfiguration entity.');
        }

        $editForm = $this->createForm(new CampaignConfigurationType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Edits an existing CampaignConfiguration entity.
     *
     * @Route("/config/{id}", name="_admin_config_update")
     * @Method("PUT")
     * @Template("BackendBundle:CampaignConfiguration:edit.html.twig")
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('BackendBundle:CampaignConfiguration')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find CampaignConfiguration entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new CampaignConfigurationType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('_admin_config_edit', array('id' => $id)));
        }

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Deletes a CampaignConfiguration entity.
     *
     * @Route("/config/{id}", name="_admin_config_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('BackendBundle:CampaignConfiguration')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find CampaignConfiguration entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('_admin_config_list'));
    }

    /**
     * Creates a form to delete a CampaignConfiguration entity by id.
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
