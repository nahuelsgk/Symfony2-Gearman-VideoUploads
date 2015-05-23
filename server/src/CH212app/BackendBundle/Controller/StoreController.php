<?php
namespace CH212app\BackendBundle\Controller;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Locale\Locale;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use CH212app\BackendBundle\Entity\Store as Store;
use CH212app\BackendBundle\Entity\User as User;
use CH212app\BackendBundle\Entity\Gift as Gift;
use CH212app\BackendBundle\Entity\EANCodeUsed as EANCodeUsed;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StoreController extends Controller
{
	/**
	 * @Route("/admin/stores/add", name="_admin_stores_new")
	 * @Template()
	 */
	public function storeAddAction(Request $request)
	{
		$store = new Store();
	
		$form = $this->createFormBuilder($store)
		->add('name')
		->add('address')
		->add('zipcode')
		->add('country', 'country')
		->getForm();
	
		if ($request->getMethod() == 'POST') {
			$form->bind($request);
				
			if ($form->isValid()) {
				$store = $form->getData();
	
				$em = $this->getDoctrine()->getManager();
				$store->setActive(true);
				$em->persist($store);
				$em->flush();
	
				return $this->redirect($this->generateUrl('_admin_stores_list'));
			}
		}
		return array('form' => $form->createView());
	}
	
	/**
	 * @Route("/admin/store/edit/{store_id}", name="_admin_store_edit", requirements={
	 *    "store_id": "\d+"
	 * }))
	 * @Template()
	 *
	 * @param integer $store_id
	 * @return multitype:NULL
	 *
	 * Action to edit a store info
	 *
	 */
	public function storeEditAction($store_id)
	{
	
		$em    = $this->getDoctrine()->getManager();
		$store = $em->getRepository('BackendBundle:Store')->find($store_id);
	
		if (!$store){
			throw $this->createNotFoundException('Controller: store not found');
		}
	
		$form = $this->createFormBuilder($store)
		->add('name')
		->add('address')
		->add('zipcode')
		->add('country', 'country')
		->add('longitud', 'text', array('max_length' => 20))
		->add('latitude', 'text', array('max_length' => 20))
		->getForm();
	
		$request = $this->getRequest();
		if ($request->getMethod() == 'POST')
		{
			$form->bind($request);
			if ($form->isValid())
			{
				$em->persist($store);
				$em->flush();
			}
		}
		return array(
				'form'  => $form->createView(),
				'store' => $store
		);
	}
	
	/**
	 * @Route("/admin/stores/list", name="_admin_stores_list")
	 * @Template()
	 */
	public function storeListAction(Request $request)
	{
		$stores = $this->getDoctrine()
		->getRepository('BackendBundle:Store')
		->findAll();
	
		$paginator = $this->get('knp_paginator');
		$pagination = $paginator->paginate(
				$stores,
				$request->query->get('page',1),
				50
		);
	
		return array(
				'pagination' => $pagination);
	}
	
	/**
	 * @Route("/admin/stores/search", name="_admin_stores_search")
	 * @Template()
	 * @param Request $request
	 */
	public function storeSearchAction(Request $request){
		$data = array();
		$form = $this->createFormBuilder($data)
		->add('zipcode', 'text', array('label' => 'Zipcode'))
		->add('country', 'country')
		->add('radius', 'integer', array(
				'label'   => 'Radius',
				'data' => 250
		)
		)
		->getForm();
	
		$stores_with_distances = array();
		$country = '';
		$zipcode = '';
		$radius  = '';
		if ($request->getMethod() == 'POST') {
			$form->bind($request);
			if ($form->isValid()) {
	
				//Readinput
				$country = $request->request->get('form')['country'];
				$zipcode = $request->request->get('form')['zipcode'];
				$radius  = $request->request->get('form')['radius'];
	
				$alessoService = $this->get('ch212app.alesso.service');
				try
				{
					$stores_with_distances = $alessoService->getClosestStores($zipcode, $country, $radius);
				}
				catch (\Exception $e){
					switch($e->getCode()){
						case "0001":
							throw $this->createNotFoundException("Controller response: Country has no gifts: ".$country);
							break;
						case "0002":
							throw $this->createNotFoundException("Controller response: No stores found for this country ".$country);
							break;
						default:
							throw $this->createNotFoundException("Controller response: No expected error. Please contact developers");
	
					}
				}
			}
		}
		return array(
				'form'                       => $form->createView(),
				'stores'                     => $stores_with_distances,
				'position_requested_zip'     => $zipcode,
				'position_requested_country' => $country,
		);
	}
	
	/**
	 * @Route("/admin/stores/{store_id}/disable", name="_admin_store_remove")
	 * @Template()
	 *
	 */
	public function storeDisableAction($store_id)
	{
	
		$em    = $this->getDoctrine()->getManager();
		$store = $em->getRepository('BackendBundle:Store')->find($store_id);
	
		if (!$store) throw $this->createNotFoundException("No store found for id ".$id);
	
		$store->setActive(false);
		$em->flush();
	
		//Redirigimos al refererer
		return $this->redirect($this->getRequest()->headers->get('referer'));
	}
	
	/**
	 * @Route("/admin/stores/{store_id}/enable", name="_admin_store_enable")
	 */
	public function storeEnableAction($store_id)
	{
		$em    = $this->getDoctrine()->getManager();
		$store = $em->getRepository('BackendBundle:Store')->find($store_id);
	
		if (!$store) throw $this->createNotFoundException("No store found for id ".$id);
	
		$store->setActive(true);
		$em->flush();
	
		//Redirigimos al refererer
		return $this->redirect($this->getRequest()->headers->get('referer'));
	}
	
	/**
	 * @Route("/admin/batch_resolve_store_coordinates/{type}", name="_admin_store_coordinates_batch", requirements={
	 *    "type": "partial|complete"
	 * })
	 * @Template()
	 *
	 * @param string $partial: If 'type' is partial, only updates those stores that has no longitude or latitude. Otherwise, resolves all again. Don't reset any value
	 *
	 * Manual batch for trigger autoresolution coordinates.
	 */
	public function storeResolveCoordinatesStoresAction($type){
		$em     = $this->getDoctrine()->getManager();
		$stores = $em->getRepository('BackendBundle:Store')->findAll();
	
		$log_string = '<h2>Begining recalculation coordinates for all stores...</h2>';
		$geocoder = $this->get('ivory_google_map.geocoder');
		$errors = 0;
		foreach($stores as $index => $store) {
			if(
					($type == 'partial' && ($store->getLongitud() == NULL || $store->getLatitude() == NULL))
					||
					$type == 'complete'
			)
			{
				$address        = $store->getAddress();
				$post_code      = $store->getZipCode();
				$country        = $store->getCountry();
				$address_string = $address. ", ".$post_code.", ".$country;
				$log_string .= "<h3> Asking to Google Api for the geoposition for Store ".$store->getId()." :  $address_string</h3>";
					
				$response = $geocoder->geocode($address_string);
				$results = $response->getResults();
	
				if (empty($results) || $results == '' || $results == null) $errors++;
	
				foreach($results as $index => $result)
				{
					$location = $result->getGeometry()->getLocation();
					$latitude = $location->getLatitude();
					$longitud = $location->getLongitude();
						
					$log_string .= "<h4>Google maps returned n. $index: Latitud: $latitude Latitud: $longitud</h4>";
					$store->setLongitud($longitud);
					$store->setLatitude($latitude);
				}
				$log_string .= "<br>";
			}
		}
		$em->flush();
		$log_string .= '<h2>End recalculation coordinates for all stores.</h2>';
		if ($errors > 0) $log_string .= "<label class='warning'>Warning: found $errors stores without results</label>";
		return array("log" => $log_string);
	}
	
	/**
	 * @Route("/admin/stores/import-csv", name="_admin_store_import_batch")
	 * @Template()
	 *
	 * This actions imports a list of stores. It's expected a file with this requeriments:
	 * Charset: UTF-8
	 * Separator: ;
	 * Encapsulated fields: "
	 * Format Columns:
	 * - Store name
	 * - Address store
	 * - Zipcode
	 * - Country: two letters (ISO 3166-1)
	 */
	public function storeImportStoreAction(Request $request)
	{
		$form = $this->createFormBuilder()
		->add('csvfile', 'file', array(
				'label'  => 'CSV to upload',
				'mapped' => false,
		))
		->getForm();
	
		//HTML build for log process result
		$log_raw  = array();
		$n_stores = 0;
		if ($request->getMethod() == 'POST')
		{
			$form->bind($request);
			if ($form->isValid()) {
				$em          = $this->getDoctrine()->getManager();
				$csv_file    = $request->files->get('form')['csvfile'];
				$resource    = fopen($csv_file->getPathname(), 'r');
	
				while(($csv_content = fgetcsv($resource, 0, ';', '"')) !== FALSE)
				{
					$name_store    = $csv_content[0]; //First column expected: name store
					$address_store = $csv_content[1]; //Second column expected: address store
					$zipcode_store = $csv_content[2]; //Third column expected: zipcode store
					$country_store = $csv_content[3]; //Fourth column expected: country code
						
					$store = new Store();
					$store->setName($name_store);
					$store->setAddress($address_store);
					$store->setZipcode($zipcode_store);
					$store->setCountry($country_store);
					$store->setActive(true);
						
					$em->persist($store);
					$n_stores++;
					$log_raw[] = " * Store inserted: $name_store on Zipcode: $zipcode_store with country: $country_store";
				}
				fclose($resource);
				$em->flush();
			}
		}
	
		$log[] = "Status: inserted $n_stores stores. ";
		return array(
				'form' => $form->createView(),
				'log'  => $log_raw
		);
	}
}