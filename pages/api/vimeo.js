import formidable from 'formidable';
let Vimeo = require('vimeo').Vimeo;
import { vimeoAccessToken, vimeoClientId, vimeoClientSecret } from '../../components/global';
let client = new Vimeo(vimeoClientId, vimeoClientSecret, vimeoAccessToken)
console.log("vimeoClientId", vimeoClientId);
console.log("vimeoClientSecret", vimeoClientSecret);
console.log("vimeoAccessToken", vimeoAccessToken);
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        console.log(err, fields, files);
        console.log("files", files["vimeo"].path);
        // console.log("files",files.name);
        let file_name = files["vimeo"].path
        client.upload(
            file_name,
            {
                'name': files["vimeo"].name,
                'description': 'videoDescription',

            },

            function (uri) {
                console.log('Your video URI is: ' + uri);
                res.status(201).json(uri)
            },
            function (bytes_uploaded, bytes_total) {
                var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
                console.log(bytes_uploaded, bytes_total, percentage + '%')

            },
            function (error) {
                console.log('Failed because: ' + error)
            }

        )

    });
};

