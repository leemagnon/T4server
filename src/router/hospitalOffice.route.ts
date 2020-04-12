import * as express from 'express';
import { hospitalOfficeService } from '../service/hospitalOffice.service';
import { verifyHospital } from '../middleware/auth.middleware';

class HospitalOfficeRoute {
    public hospitalOfficeRouter: express.Router = express.Router();
    constructor() {
        this.hospitalOfficeRouter.post('/office/hpid/:hpid', verifyHospital, registerHospitalOffice); // 진료실 등록.
        this.hospitalOfficeRouter.patch('/office/officeIndex/:officeIndex', verifyHospital, updateHospitalOffice); // 진료실 정보 변경.
        this.hospitalOfficeRouter.delete('/office/officeIndex/:officeIndex', verifyHospital, deleteHospitalOffice); // 진료실 삭제.
        this.hospitalOfficeRouter.get('/office/hpid/:hpid', verifyHospital, getHospitalOffices);
    }
}

async function getHospitalOffices(req, res) {
    const hpid: string = req.params.hpid;
    try {
        const result = await hospitalOfficeService.getOffices(hpid);

        res.send({
            success: true,
            result,
            message: 'getHospitalOffices: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'getHospitalOffices: 500'
        });
    }
}

async function registerHospitalOffice(req, res) { // 입력 데이터: officeName, treatmentName
    const hpid: string = req.params.hpid;
    const officeName: string = req.body.officeName; // 예: 김똑닥 선생님 - 내과
    let treatmentNameArr: Array<string>;
    const registerOfficeData = {
        hpid: hpid,
        officeName: officeName
    };

    try {
        const result = await hospitalOfficeService.registerHospitalOffice(registerOfficeData);
        const officeIndex = result.getDataValue("officeIndex");

        if (req.body.treatmentName) { // 만약 진료항목을 등록했으면 (진료항목은 배열로 받는다)
            treatmentNameArr = req.body.treatmentName;
            let registerTreatmentData;

            for (const treatmentName of treatmentNameArr) {
                registerTreatmentData = {
                    officeIndex: officeIndex,
                    treatmentName: treatmentName
                };

                await hospitalOfficeService.registerTreatment(registerTreatmentData);
            }

            res.send({
                success: true,
                message: 'registerHospitalOffice: 200'
            });
        }
        res.send({
            success: true,
            message: 'registerHospitalOffice: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'registerHospitalOffice: 500'
        });
    }
}

async function updateHospitalOffice(req, res) {
    const officeIndex: number = req.params.officeIndex;
    const alterOfficeName: string = req.body.alterOfficeName;
    const alterTreatmentNameArr: Array<string[]> = req.body.alterTreatmentName; // 바꿀 진료항목 이름 -> 이차원 배열로 받기. [['변경전이름', '변경후이름']]
    const newTreatmentNameArr: Array<string[]> = req.body.newTreatmentNameArr; // 새로 추가되는 진료항목 이름.
    const alterOfficeData = {
        officeName: alterOfficeName,
        treatmentNameArr: alterTreatmentNameArr,
        newTreatmentNameArr: newTreatmentNameArr
    };

    try {
        await hospitalOfficeService.updateHospitalOffice(officeIndex, alterOfficeData);
        res.send({
            success: true,
            message: 'updateHospitalOffice: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'updateHospitalOfficeName: 500'
        });
    }
}


async function deleteHospitalOffice(req, res) {
    try {
        const officeIndex: number = req.params.officeIndex;
        await hospitalOfficeService.deleteHospitalOffice(officeIndex);
        res.send({
            success: true,
            message: 'deleteHospitalOffice: 200'
        });
    } catch (err) {
        res.send({
            success: false,
            result: err,
            message: 'deleteHospitalOffice: 500'
        });
    }
}

export const hospitalOfficeRoute = new HospitalOfficeRoute();