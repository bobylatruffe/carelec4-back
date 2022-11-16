const toStandardiser = require("../../mesModules/standardisation/standardisation");
const { getLibelle } = require("../../mesModules/getLibelle/getLibelle");
const { getCarnetsEntretiensSdd } = require("../../mesModules/carnetsEntretiens/initCarnetsEntretiensSdd")

const router = require("express").Router();  // classe pour créer des gestionnaires de route modulaires et pouvant être montés

router.get("/:numImmat", (req, resp) => {
  getLibelle(req.params.numImmat)
    .then(data => {
      return resp.json(toStandardiser(getCarnetsEntretiensSdd(), data))
    })
    .catch(err => {
      return resp.status(500).json({
        message: "Impossible de standardiser avec cette plaque"
      })
    })
});

router.get("/*", (_, resp) => {
  return resp.status(500).json({ message: "Merci de fournir une plaque d'immatriculation" });
});

module.exports = router;