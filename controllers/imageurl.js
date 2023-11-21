///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
///////////////////////////////////////////////////////////////////////////////////////////////////

// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = process.env.CLARIFAI_API_PAT;
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = process.env.CLARIFAI_API_USER_ID;
const APP_ID = "face-recognition";
// Change these to whatever model and image URL you want to use
const MODEL_ID = "face-detection";
// const IMAGE_URL = imageUrl;

///////////////////////////////////////////////////////////////////////////////////
// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
///////////////////////////////////////////////////////////////////////////////////

import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            user_app_id: {
                user_id: USER_ID,
                app_id: APP_ID,
            },
            model_id: MODEL_ID,
            inputs: [
                {
                    data: {
                        image: {
                            url: req.body.input,
                            allow_duplicate_url: true,
                        },
                    },
                },
            ],
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }

            if (response.status.code !== 10000) {
                throw new Error(
                    "Post model outputs failed, status: " +
                        response.status.description
                );
            }

            // Since we have one input, one output will exist here
            const output = response.outputs[0];

            // console.log("Predicted concepts:");
            // for (const region of output.data.regions) {
            //     console.log(region.region_info + " " + region.value);
            // }
            res.json(response);
        }
    );
};

export default { handleApiCall };
