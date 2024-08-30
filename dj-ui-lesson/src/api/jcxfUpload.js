import {request} from "@/utils/request-jcxf";

export const upload = (data) => {
    return request('jcxf/app/upload', data)
}

export const uploadUploadAjax = (data) => {
    return request('jcxf/admin/uploadAjax', data)
}
