<?php 
namespace CH212app\BackendBundle\Service;

class URLPublicBuilder
{
	private $domain;

	public function __construct($domain)
	{
		$this->domain = $domain;
	}
	
	public function buildMainUrl()
	{
		return $this->domain.'/';
	}
	
	public function buildDownloadPDF($lang=null, $gift=null)
	{
		return $this->domain."/pdfs/pdf-sample.pdf";
	}
	
	public function buildEqualizerUrl()
	{
		return $this->domain."/#ecualizador";
	}
	
	public function buildParticipantsGallery()
	{
		return $this->domain."/#timeline/how-to-participate";
	}
	
	public function buildPreviewImage($preview_image_path)
	{
		$paths = explode('/server/web/', $preview_image_path);
		$previewImageURL = $this->domain.'/server/web/'.$paths[1];
		return $previewImageURL; 
	}
	
	public function buildMyVideoURL($hotspot, $confirm_token){
		return $this->domain . "#participate/$hotspot/config-video/done/$confirm_token";
	}
}
?>
