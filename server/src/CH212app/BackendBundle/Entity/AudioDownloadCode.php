<?php

namespace CH212app\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * AudioDownloadCode
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class AudioDownloadCode
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="code", type="string", length=255, unique=true, nullable=false)
     */
    private $code;

    /**
     * @ORM\OneToOne(targetEntity="CH212app\BackendBundle\Entity\User", inversedBy="audiodownloadcode")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="SET NULL")
     **/
    private $user;
    
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
     * Set code
     *
     * @param string $code
     * @return AudioDownloadCode
     */
    public function setCode($code)
    {
        $this->code = $code;

        return $this;
    }

    /**
     * Get code
     *
     * @return string 
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     * Set user
     *
     * @param \CH212app\BackendBundle\Entity\User $user
     * @return AudioDownloadCode
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
