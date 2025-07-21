import { Request, Response } from "express";


let spotifyAccessToken: string | null = null
export const getSpotifyAccessToken = async (req: Request, res: Response) => {

    let refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;


    // let code = ``

    // let authOptionsForRefreshToken = {
    //     url: 'https://accounts.spotify.com/api/token',
    //     form: {
    //         code: code,
    //         redirect_uri: "https://web2conversion.com/",
    //         grant_type: 'authorization_code'
    //     },
    //     headers: {
    //         'content-type': 'application/x-www-form-urlencoded',
    //         // @ts-ignore
    //         'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
    //     },
    //     json: true
    // };
    // console.log("authOptionsForRefreshToken", authOptionsForRefreshToken.headers.Authorization);
    // try {
    //     const response = await fetch(authOptionsForRefreshToken.url, {
    //         method: 'POST',
    //         headers: authOptionsForRefreshToken.headers,
    //         body: new URLSearchParams(authOptionsForRefreshToken.form)
    //     })
    //         .then(response => response.json())
    //         .then(data => data)
    //     if (response) {
    //         console.log("Refresh token response", response);
    //         refresh_token = response.refresh_token;
    //     } else {
    //         throw new Error("Error: while obtaining refresh token for spotify");
    //     }
    // } catch (err: any) {
    //     res.status(500).json({ message: "Server error", error: err?.message || "Error while obtaining access token for spotify" });
    // }


    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    try {
        const response = await fetch(authOptions.url, {
            method: 'POST',
            headers: authOptions.headers,
            //@ts-ignore
            body: new URLSearchParams(authOptions.form)
        })
            .then(response => response.json())
            .then(data => data)
        if (response) {
            // console.log("Access token response", response);
            spotifyAccessToken = response.access_token;
            // res.json(response);
        } else {
            throw new Error("Error: while obtaining access token for spotify");
        }
    } catch (err: any) {
        res.status(500).json({ message: "Server error", error: err?.message || "Error while obtaining access token for spotify" });
    }
}

export const searchSongs = async (req: Request, res: Response) => {
    try {
        // console.log("Search query", req.body.searchQuery);
        // console.log("Access token", spotifyAccessToken);
        if (!spotifyAccessToken) {
            console.log("Spotify Access token not found");
            await getSpotifyAccessToken(req, res);
            // console.log("Access token generated", spotifyAccessToken);
        }
        const { searchQuery } = req.body;
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=5`,
            {
                headers: {
                    Authorization: `Bearer ${spotifyAccessToken}`,
                },
            }
        );
        const data = await response.json();
        res.status(200).json(data);
    } catch (err: any) {
        res.status(500).json({ message: "Server error", error: err?.message || "Error while registering user" });
    }
};