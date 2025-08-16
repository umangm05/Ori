import React, { useEffect, useState } from 'react'
import Ory from '../services/Ory/Ory';
import { FrontendApi, Configuration } from "@ory/client"

export default function OryProvider({ children }) {

    const [session, setSession] = useState();
    const [logoutUrl, setLogoutUrl] = useState();

    // Get your Ory url from .env
    // Or localhost for local development
    const basePath = "http://localhost:4000"
    const ory = new FrontendApi(
        new Configuration({
            basePath,
            baseOptions: {
                withCredentials: true,
            },
        }),
    )

     // Second, gather session data, if the user is not logged in, redirect to login
  useEffect(() => {
    ory
      .toSession()
      .then(({ data }) => {
        console.log("🚀 ~ .then ~ data:", data)
        // User has a session!
        setSession(data)
        ory.createBrowserLogoutFlow().then(({ data }) => {
          // Get also the logout url
          setLogoutUrl(data.logout_url)
        })
      })
      .catch((err) => {
        console.error(err)
        // Redirect to login page
        window.location.replace(`${basePath}/ui/login`)
      })
  }, []);

  if (!session) {
    // Still loading
    return <h1>Loading...</h1>
  }

    return children;
}
