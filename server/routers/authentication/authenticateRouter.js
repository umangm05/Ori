const express = require('express');
const router = express.Router();
var sdk = require("@ory/client");

var ory = new sdk.FrontendApi(
  new sdk.Configuration({
    basePath: "http://localhost:4000",  // Use only one basePath,
    baseOptions: {
      withCredentials: true,
    },
  })
);

router.post('/signup', async (req, res) => {
  const { email = "", password = "Abc@1234", role = "customer" } = req.body || {};

  try {
    // 1. Initialize the registration flow
    const flowResponse = await ory.createBrowserRegistrationFlow();

    // Log the flow response for debugging
    console.log("🚀 ~ flowResponse:", flowResponse);
    const flow = flowResponse.data;
    console.log("🚀 ~ router.post ~ flow:", flow)

    // 2. Update the registration flow with user details
    const updateResponse = await ory.updateRegistrationFlow({
      flow: flow.id,
      updateRegistrationFlowBody: {
        method: "password",  // Specify the method you're using
        password: password,  // Password from the request body
        traits: {
          email: email,      // Email from the request body
          role: role         // User role (customer or admin)
        }
      }
    });

    // Log and send back the registration result
    console.log("🚀 ~ updateResponse:", updateResponse);
    res.status(200).json({ message: "User registered successfully!", data: updateResponse.data });
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error)
    // Handle any errors that occur during registration
    console.error("🚀 ~ Registration error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

/* GET home page. */
router.get("/", function (req, res, next) {
  ory
    .toSession({ cookie: req.header("cookie") })
    .then(({ data: session }) => {
      res.render("index", {
        title: "Express",
        // Our identity is stored in the session along with other useful information.
        identity: session.identity,
      })
    })
    .catch(() => {
      // If logged out, send to login page
      res.redirect("/.ory/ui/login")
    })
})

router.post('/login', async (req, res) => {
  try {
    const loginResponse = await ory.login.login(
      {
        challenge: 'your-login-challenge', // Replace with the actual challenge
      },
      (error, response) => {
        if (error) {
          console.error(error);
        } else {
          // Handle successful login, e.g., set session cookie
          res.json(response);
        }
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Login failed');
  }
});

module.exports = router
