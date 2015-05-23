<?php
namespace CH212app\BackendBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * AppData
 *
 * @ORM\Entity
 * @ORM\Table(name="campaign_conf")
 */
class CampaignConfiguration
{
	
	/**
	 * @ORM\Column(name="id", type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 *
	 * @var integer
	 */
	private $id;
	
	/**
	 * @ORM\Column(type="string", length=255, nullable=false)
	 */
	private $name;
	
	/**
	 * @ORM\Column(type="string", length=255, nullable=false)
	 */
	private $value;
	
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
     * Set name
     *
     * @param string $name
     * @return CampaignConfiguration
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set value
     *
     * @param string $value
     * @return CampaignConfiguration
     */
    public function setValue($value)
    {
        $this->value = $value;

        return $this;
    }

    /**
     * Get value
     *
     * @return string 
     */
    public function getValue()
    {
        return $this->value;
    }
}
