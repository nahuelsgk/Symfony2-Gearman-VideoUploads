<?php
namespace CH212app\BackendBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * AudioDownloadCode controller.
 *
 * @Route("/admin/dashboard")
 */
class DashboardController extends Controller
{
    /*
     * Return the result from a sql count query
     */
    private function countSqlQuery($sql) {
        $count = 0;
        try {
            $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
            $stmt->execute();

            $query = $stmt->fetchAll();
            if($query) {
                $count = $query[0]["count(*)"];
            }
        } catch (Exception $e) {
            echo 'Excepción capturada: ',  $e->getMessage(), "\n";
        }

        #\Doctrine\Common\Util\Debug::Dump(($query));

        return $count;
    }

    /*
     * Return the number of users saved in db
     */
    private function getTotaltUsers($filter) {
        $sql = "SELECT count(*) FROM `usuarios`";
		if (!empty($filter["country"])) {
			$sql .= " WHERE `usuarios`.`country`='" . $filter["country"] . "'";
		}
		if (!empty($filter["date_ini"]) && !empty($filter["date_out"])) {
			if (!empty($filter["country"])) {
				$sql .= " AND";
			} else {
				$sql .= " WHERE";
			}
			$sql .= " `usuarios`.`created` BETWEEN '" . $filter["date_ini"] . " 00:00:00' AND '" . $filter["date_out"] . " 23:59:59'";
		}
        $total_users = $this->countSqlQuery($sql);

        return $total_users;
    }

    /*
     * Return the number of users born after 1990
     */
    private function usersBornAfter1990($filter) {
        $sql = "SELECT count(*) FROM `usuarios` WHERE year(`dateBirth`) > 1990";
	    if (!empty($filter["country"])) {
		    $sql .= " AND `usuarios`.`country`='" . $filter["country"] . "'";
	    }
	    if (!empty($filter["date_ini"]) && !empty($filter["date_out"])) {
		    $sql .= " AND `usuarios`.`created` BETWEEN '" . $filter["date_ini"] . " 00:00:00' AND '" . $filter["date_out"] . " 23:59:59'";
	    }
        $total_users = $this->countSqlQuery($sql);

        return $total_users;
    }

    /*
     * Return the number of users born between 1985 and 1990
     */
    private function usersBornBetween1985_1990($filter) {
        $sql = "SELECT count(*) FROM `usuarios` WHERE year(`dateBirth`) <= 1990 AND year(`dateBirth`) >= 1985";
	    if (!empty($filter["country"])) {
		    $sql .= " AND `usuarios`.`country`='" . $filter["country"] . "'";
	    }
	    if (!empty($filter["date_ini"]) && !empty($filter["date_out"])) {
		    $sql .= " AND `usuarios`.`created` BETWEEN '" . $filter["date_ini"] . " 00:00:00' AND '" . $filter["date_out"] . " 23:59:59'";
	    }
        $total_users = $this->countSqlQuery($sql);

        return $total_users;
    }

    /*
     * Return the number of users born between 1980 and 1985
     */
    private function usersBornBetween1980_1985($filter) {
        $sql = "SELECT count(*) FROM `usuarios` WHERE year(`dateBirth`) < 1985 AND year(`dateBirth`) >= 1980";
	    if (!empty($filter["country"])) {
		    $sql .= " AND `usuarios`.`country`='" . $filter["country"] . "'";
	    }
	    if (!empty($filter["date_ini"]) && !empty($filter["date_out"])) {
		    $sql .= " AND `usuarios`.`created` BETWEEN '" . $filter["date_ini"] . " 00:00:00' AND '" . $filter["date_out"] . " 23:59:59'";
	    }
        $total_users = $this->countSqlQuery($sql);

        return $total_users;
    }

    /*
     * Return the number of users born before 1980
     */
    private function usersBornBefore1980($filter) {
        $sql = "SELECT count(*) FROM `usuarios` WHERE year(`dateBirth`) < 1980";
	    if (!empty($filter["country"])) {
		    $sql .= " AND `usuarios`.`country`='" . $filter["country"] . "'";
	    }
	    if (!empty($filter["date_ini"]) && !empty($filter["date_out"])) {
		    $sql .= " AND `usuarios`.`created` BETWEEN '" . $filter["date_ini"] . " 00:00:00' AND '" . $filter["date_out"] . " 23:59:59'";
	    }
        $total_users = $this->countSqlQuery($sql);

        return $total_users;
    }

    /*
     * Return the total number of videos in db
     */
    private function totalVideos($filter) {
        $sql = "SELECT count(*) FROM `video` INNER JOIN `usuarios` ON `video`.`user_id` = `usuarios`.`id`";
	    if (!empty($filter["country"])) {
		    $sql .= " WHERE `usuarios`.`country`='" . $filter["country"] . "'";
	    }
	    if (!empty($filter["date_ini"]) && !empty($filter["date_out"])) {
		    if (!empty($filter["country"])) {
			    $sql .= " AND";
		    } else {
			    $sql .= " WHERE";
		    }
		    $sql .= " `usuarios`.`created` BETWEEN '" . $filter["date_ini"] . " 00:00:00' AND '" . $filter["date_out"] . " 23:59:59'";
	    }
        $total_videos = $this->countSqlQuery($sql);

        return $total_videos;
    }

    /*
     * get an array with the stats for all the languages in db
     */
    private function getStatsLanguages($filter) {
		$languages = array("es"=>0,"en"=>0,"pt"=>0);
		$sql = "SELECT locale, count(*) FROM `usuarios`";
	    if (!empty($filter["country"])) {
		    $sql .= " WHERE `usuarios`.`country`='" . $filter["country"] . "'";
	    }
	    if (!empty($filter["date_ini"]) && !empty($filter["date_out"])) {
		    if (!empty($filter["country"])) {
			    $sql .= " AND";
		    } else {
			    $sql .= " WHERE";
		    }
		    $sql .= " `usuarios`.`created` BETWEEN '" . $filter["date_ini"] . " 00:00:00' AND '" . $filter["date_out"] . " 23:59:59'";
	    }
		$sql .= " group by locale";
		$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
		$stmt->execute();
		$query_result = $stmt->fetchAll();
		if ($query_result) {
			foreach ($query_result as $locale_count) {
				$languages[$locale_count["locale"]] = $locale_count["count(*)"];
			}
		}
		return $languages;
    }

    /*
     * get Hotspot from video tables
     */
    private function getHotspotVideos($filter) {
		$hotspot = array("kiss" => 0, "ready" => 0, "dance" => 0, "selfie" => 0);
        $sql = "SELECT video.hotspot, count(*) FROM `video`";
		if (!empty($filter["country"])) {
			$sql .= " INNER JOIN `usuarios` ON `video`.`user_id` = `usuarios`.`id` WHERE `usuarios`.`country`='" . $filter["country"] . "'";
		}
	    if (!empty($filter["date_ini"]) && !empty($filter["date_out"])) {
		    if (!empty($filter["country"])) {
			    $sql .= " AND";
		    } else {
			    $sql .= " INNER JOIN `usuarios` ON `video`.`user_id` = `usuarios`.`id`  WHERE";
		    }
		    $sql .= " `usuarios`.`created` BETWEEN '" . $filter["date_ini"] . " 00:00:00' AND '" . $filter["date_out"] . " 23:59:59'";
	    }
		$sql .= " group by `video`.`hotspot`";
        $stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
        $stmt->execute();

        $query_result = $stmt->fetchAll();
        if($query_result) {
            foreach($query_result as $hotspot_count) {
                $hotspot[$hotspot_count["hotspot"]] = $hotspot_count["count(*)"];
            }
        }

        return $hotspot;
    }

    /*
     * get video retos
     */
    public function getChallenges($filter) {
        $sql_video = "SELECT count(*) FROM `usuarios` INNER JOIN video ON `usuarios`.`id` = `video`.`user_id`";
		if (!empty($filter["country"])) {
			$sql_video .= " WHERE `usuarios`.`country`='" . $filter["country"] . "'";
		}
	    if (!empty($filter["date_ini"]) && !empty($filter["date_out"])) {
		    if (!empty($filter["country"])) {
			    $sql_video .= " AND";
		    } else {
			    $sql_video .= " WHERE";
		    }
		    $sql_video .= " `usuarios`.`created` BETWEEN '" . $filter["date_ini"] . " 00:00:00' AND '" . $filter["date_out"] . " 23:59:59'";
	    }
        $sql_ean = "SELECT count(*) FROM `usuarios` INNER JOIN eancodes_used ON `usuarios`.`id` = `eancodes_used`.`user_id`";
		if (!empty($filter["country"])) {
			$sql_ean .= " WHERE `usuarios`.`country`='" . $filter["country"] . "'";
		}
	    if (!empty($filter["date_ini"]) && !empty($filter["date_out"])) {
		    if (!empty($filter["country"])) {
			    $sql_ean .= " AND";
		    } else {
			    $sql_ean .= " WHERE";
		    }
		    $sql_ean .= " `usuarios`.`created` BETWEEN '" . $filter["date_ini"] . " 00:00:00' AND '" . $filter["date_out"] . " 23:59:59'";
	    }
        return array(
            "video" => $this->countSqlQuery($sql_video),
            "reward" => 0,
            "ean" => $this->countSqlQuery($sql_ean)
        );
    }

	/*
	 * get an array with the stats for all the countries in db
	 */
	private function getStatsCountries($filter) {
		$countries = array();
		$sql = "SELECT country, count(*) FROM `usuarios` WHERE `usuarios`.`created` BETWEEN '" . $filter["date_ini"] . " 00:00:00' AND '" . $filter["date_out"] . " 23:59:59' group by country";
		$stmt = $this->getDoctrine()->getManager()->getConnection()->prepare($sql);
		$stmt->execute();

		$query_result = $stmt->fetchAll();
		if($query_result) {
			foreach($query_result as $country) {
				$countries[] = array($country["country"],$country["count(*)"]);
			}
		}
		return $countries;
	}

    /**
     * @Route("/", name="admin_dashboard")
     * @Template()
     */
	public function indexAction(Request $request)
	{
		//$country = ($request->get('country')) ? $request->get('country') : "es";
		$date_ini = ($request->get('date-ini')) ? $request->get('date-ini') : '2015-05-04';
		$date_out = ($request->get('date-out')) ? $request->get('date-out') : '2015-08-31';
		$country = $request->get('country');

		$filter = [
			"country" => $country,
			"date_ini" => $date_ini,
			"date_out" => $date_out
		];

		$languages = $this->getStatsLanguages($filter);
		$hotspot = $this->getHotspotVideos($filter);
		$challenges = $this->getChallenges($filter);
		$context = array(
			"user" => [
				"total" => $this->getTotaltUsers($filter),
				"age" => [
					"under_25" => $this->usersBornAfter1990($filter),
					"between_25_30" => $this->usersBornBetween1985_1990($filter),
					"between_31_35" => $this->usersBornBetween1980_1985($filter),
					"beyond_35" => $this->usersBornBefore1980($filter)
				],
				"language" => [
					"english" => $languages["en"],
					"spanish" => $languages["es"],
					"portuguese" => $languages["pt"]
				],
				"challenges" => [
					"video" => $challenges["video"],
					"reward" => $challenges["reward"],
					"ean" => $challenges["ean"]
				]
			],
			"videos" => [
				"total" => $this->totalVideos($filter),
				"hotspot" => [
					"kiss" => $hotspot["kiss"],
					"get_ready" => $hotspot["ready"],
					"dance" => $hotspot["dance"],
					"selfie" => $hotspot["selfie"]
				]
			],
			"countries" => $this->getStatsCountries($filter),
			"filter" => $filter
		);
		return $context;
    }
}

