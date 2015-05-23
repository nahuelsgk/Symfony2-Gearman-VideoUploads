<?php
namespace CH212app\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;


/**
 * EANCode
 *
 * @ORM\Entity
 * @ORM\Table(name="eancodes_used")
 */
class EANCodeUsed{
	
	/**
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 *
	 * @var integer
	 */
	private $id;
	
	/**
	 * @ORM\ManyToOne(targetEntity="CH212app\BackendBundle\Entity\User", inversedBy = "eanCodesUsed", cascade={"persist", "remove"})
	 */
	private $user;
	
	/**
	 * @ORM\Column(type="string", length=255, nullable=false)
	 */
	private $codeUsed;
	
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
     * Set codeUsed
     *
     * @param string $codeUsed
     * @return EANCodeUsed
     */
    public function setCodeUsed($codeUsed)
    {
        $this->codeUsed = $codeUsed;

        return $this;
    }

    /**
     * Get codeUsed
     *
     * @return string 
     */
    public function getCodeUsed()
    {
        return $this->codeUsed;
    }

    /**
     * Set user
     *
     * @param \CH212app\BackendBundle\Entity\User $user
     * @return EANCodeUsed
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
}
