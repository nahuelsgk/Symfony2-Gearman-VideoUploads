<?php
namespace CH212app\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Video
 *
 * @ORM\Entity
 * @ORM\Table(name="video")
 * @ORM\HasLifecycleCallbacks
 */
class Video{

	const STATUS_NEW      = 'new';
	const STATUS_REJECTED = 'rejected';
	const STATUS_APPROVED = 'approved';

	/**
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 *
	 * @var integer
	 */
	private $id;

	/**
	 * @ORM\ManyToOne(targetEntity="CH212app\BackendBundle\Entity\User", inversedBy = "videos", cascade={"remove"})
	 */
	private $user;

	/**
	 * @ORM\Column(type="string", length=255, nullable=false)
	 */
	private $path;

	/**
	 * @ORM\Column(type="string")
	 */
	private $hotspot;

	/**
	 * @Assert\File(maxSize="6000000")
	 */
	private $file;

	/**
	 * @ORM\Column(type="string", length=255, nullable=false)
	 */
	private $originalName;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
	private $mimeType;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
	private $extension;

	/**
	 * @ORM\Column(type="string", columnDefinition="ENUM('new', 'rejected', 'approved')");
	 */
	private $status;

	/**
	 * @ORM\Column(type="boolean", options={"default":0})
	 */
	private $confirmedByUser;

	/**
	 * @ORM\Column(type="string", length=255, nullable=true)
	 */
	private $ip;

	/**
	 * @ORM\Column(type="datetime")
	 */
	private $created;

	 /**
	 * @ORM\Column(type="string", nullable=true)
     */
    private $previewItaliano;

	 /**
	 * @ORM\Column(type="string", nullable=true)
     */
    private $previewWaldengrid;

	 /**
	 * @ORM\Column(type="string", nullable=true)
     */
    private $previewLightleaks;

	 /**
	 * @ORM\Column(type="string", nullable=true)
     */
    private $render;

	/**
	 * @ORM\Column(type="boolean", nullable=true)
	 */
	private $fake;

	/**
	 * Sets file.
	 *
	 * @param UploadedFile $file
	 */
	public function setFile(UploadedFile $file = null)
	{
		$this->file = $file;
		// check if we have an old image path
		if (isset($this->path)) {
			// store the old name to delete after the update
			$this->temp = $this->path;
			$this->path = null;
		} else {
			$this->path = 'initial';
		}
	}

	/**
	 * Get file.
	 *
	 * @return UploadedFile
	 */
	public function getFile()
	{
		return $this->file;
	}

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set user
     *
     * @param \CH212app\BackendBundle\Entity\User $user
     * @return Video
     */
    public function setUser(\CH212app\BackendBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \CH212app\BackendBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Ruta absoluta del directorio
     * @return Ambigous <NULL, string>
     */
    public function getAbsolutePath()
    {
    	return null == $this->path ? null : $this->getUploadDir().'/'.$this->path;
    }

    /**
     * Ruta relativa al directorio raiz del donde se guarda
     * @return string
     */
    protected function getUploadDir()
    {
    	return 'uploads/documents';
    }

    /**
     * Directorio con la ruta absoluta donde se guardar los videos
     *
     * @TODO: Parametrizar el directorio
     *
     * @return string
     */
    protected function getUploadRootDir()
    {
    	//Directorio absoluto en el que se deberia salvar el video
    	return __DIR__.'/../../../../web/'.$this->getUploadDir();
    }

    /**
     * Set path
     *
     * @param string $path
     * @return Video
     */
    public function setPath($path)
    {
        $this->path = $path;

        return $this;
    }

    /**
     * Get path
     *
     * @return string
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * @ORM\PrePersist()
     * @ORM\PreUpdate()
     */
    public function preUpload()
    {
    	if (null !== $this->getFile()) {
    		// do whatever you want to generate a unique name
    		$filename = sha1(uniqid(mt_rand(), true));
    		$ext = $this->getFile()->guessExtension();
    		if ($ext == "qt") $ext = 'mov';   //BUG FOR MOV FILES
    		$this->path = $filename.'.'.$ext;
    	}
    }

    /**
     * @ORM\PostPersist()
     * @ORM\PostUpdate()
     */
    public function upload()
    {
    	// the file property can be empty if the field is not required
    	if (null === $this->getFile()) {
    		return;
    	}

    	// use the original file name here but you should
    	// sanitize it at least to avoid any security issues

    	// move takes the target directory and then the
    	// target filename to move to
    	$this->getFile()->move($this->getUploadRootDir(), $this->path);


    	 // check if we have an old image
        if (isset($this->temp)) {
            // delete the old image
            unlink($this->getUploadRootDir().'/'.$this->temp);
            // clear the temp image path
            $this->temp = null;
        }
        $this->file = null;
    }

    /**
     * @ORM\PostRemove()
     */
    public function removeUpload()
    {
    	var_dump($this->getAbsolutePath());
    	if ($file = $this->getAbsolutePath()) {
    		if (file_exists ($file)) unlink($file);
    	}
    }

    /**
     * Set originalName
     *
     * @param string $originalName
     * @return Video
     */
    public function setOriginalName($originalName)
    {
        $this->originalName = $originalName;

        return $this;
    }

    /**
     * Get originalName
     *
     * @return string
     */
    public function getOriginalName()
    {
        return $this->originalName;
    }

    /**
     * Set mimeType
     *
     * @param string $mimeType
     * @return Video
     */
    public function setMimeType($mimeType)
    {
        $this->mimeType = $mimeType;

        return $this;
    }

    /**
     * Get mimeType
     *
     * @return string
     */
    public function getMimeType()
    {
        return $this->mimeType;
    }

    /**
     * Set extension
     *
     * @param string $extension
     * @return Video
     */
    public function setExtension($extension)
    {
        $this->extension = $extension;

        return $this;
    }

    /**
     * Get extension
     *
     * @return string
     */
    public function getExtension()
    {
        return $this->extension;
    }

    /**
     * Set status
     *
     * @param string $status
     * @return Video
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get status
     *
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set ip
     *
     * @param string $ip
     * @return Video
     */
    public function setIp($ip)
    {
        $this->ip = $ip;

        return $this;
    }

    /**
     * Get ip
     *
     * @return string
     */
    public function getIp()
    {
        return $this->ip;
    }

    /**
     * Set created
     *
     * @param \DateTime $created
     * @return Video
     */
    public function setCreated($created)
    {
        $this->created = $created;

        return $this;
    }

    /**
     * Get created
     *
     * @return \DateTime
     */
    public function getCreated()
    {
        return $this->created;
    }

    /**
     * Set confirmedByUser
     *
     * @param boolean $confirmedByUser
     * @return Video
     */
    public function setConfirmedByUser($confirmedByUser)
    {
        $this->confirmedByUser = $confirmedByUser;

        return $this;
    }

    /**
     * Get confirmedByUser
     *
     * @return boolean
     */
    public function getConfirmedByUser()
    {
        return $this->confirmedByUser;
    }

    /**
     * Set hotspot
     *
     * @param string $hotspot
     * @return Video
     */
    public function setHotspot($hotspot)
    {
        $this->hotspot = $hotspot;

        return $this;
    }

    /**
     * Get hotspot
     *
     * @return string
     */
    public function getHotspot()
    {
        return $this->hotspot;
    }

    /**
     * Set fake
     *
     * @param boolean $fake
     * @return Video
     */
    public function setFake($fake)
    {
        $this->fake = $fake;

        return $this;
    }

    /**
     * Get fake
     *
     * @return boolean
     */
    public function getFake()
    {
        return $this->fake;
    }

    /**
     * Set previewItaliano
     *
     * @param string $previewItaliano
     * @return Video
     */
    public function setPreviewItaliano($previewItaliano)
    {
        $this->previewItaliano = $previewItaliano;

        return $this;
    }

    /**
     * Get previewItaliano
     *
     * @return string 
     */
    public function getPreviewItaliano()
    {
        return $this->previewItaliano;
    }

    /**
     * Set previewWaldengrid
     *
     * @param string $previewWaldengrid
     * @return Video
     */
    public function setPreviewWaldengrid($previewWaldengrid)
    {
        $this->previewWaldengrid = $previewWaldengrid;

        return $this;
    }

    /**
     * Get previewWaldengrid
     *
     * @return string 
     */
    public function getPreviewWaldengrid()
    {
        return $this->previewWaldengrid;
    }

    /**
     * Set previewLightleaks
     *
     * @param string $previewLightleaks
     * @return Video
     */
    public function setPreviewLightleaks($previewLightleaks)
    {
        $this->previewLightleaks = $previewLightleaks;

        return $this;
    }

    /**
     * Get previewLightleaks
     *
     * @return string 
     */
    public function getPreviewLightleaks()
    {
        return $this->previewLightleaks;
    }

    /**
     * Set render
     *
     * @param string $render
     * @return Video
     */
    public function setRender($render)
    {
        $this->render = $render;

        return $this;
    }

    /**
     * Get render
     *
     * @return string 
     */
    public function getRender()
    {
        return $this->render;
    }
}
