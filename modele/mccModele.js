class MccModele {

    constructor() {
        this.modele = {
            ra: 5.0,
            c0: 0.1,
            f: 1e-3,
            uan: 220.0,
            ian: 6.0,
            ien: 240,
            vitn: 2100,
        }
        //
        this.reglages = {
            ua: 0,
            ie: 0,
            cr: 0,
        }
        //
        this.mesures = {
            ia: 0,
            vit: 0,
            pabs: 0,
            put: 0,
        }
    }
    //
    afficheModele(){
        console.log(this.modele)
    }
    //
    getModele() {
        return this.modele
    }
    //
    getReglages() {
        return this.reglages
    }
    //
    getMesures() {
        return this.mesures
    }
    //
    setModele(ra, c0, f, uan, ian, ien, vitn) {
        this.modele.ra = ra
        this.modele.c0 = c0
        this.modele.f = f
        this.modele.uan = uan
        this.modele.ian = ian
        this.modele.ien = ien
        this.modele.vitn = vitn
    }
    //
    setReglages(les_reglages) {
        this.reglages = les_reglages
    }
    //
    process(cb) {
        //
        let omegan = (2 * this.modele.vitn * Math.PI) / 60
        let kphin = (this.modele.uan - this.modele.ra * this.modele.ian) / omegan

        let kphi = (kphin *this.reglages.ie) / this.modele.ien

        let num = (this.reglages.ua * this.modele.f) + (this.modele.c0 + this.reglages.cr) * kphi

        let den = (this.modele.ra * this.modele.f) + (kphi * kphi)

        this.mesures.ia = (num / den)

        //courant Ia
        if (this.mesures.ia < 0 || this.reglages.ua <= 0) {
            this.mesures.ia = 0
        }

        //vitesse
        let omega = (this.reglages.ua - this.modele.ra * this.mesures.ia) / kphi
        if (omega < 0)
            omega = 0;

        this.mesures.vit = (omega * 60) / (2 * Math.PI)

        //Pabs
        this.mesures.pabs = this.reglages.ua * this.mesures.ia

        //Puissance utile
        this.mesures.put = this.reglages.cr * omega

        //
        cb(this.mesures)
    }
}
//
module.exports = MccModele
