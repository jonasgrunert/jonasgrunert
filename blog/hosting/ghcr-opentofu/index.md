---
title: How to pull images from ghcr.io using Opentofu in a Github Workflow
tags:
  - opentofu
  - github
  - actions
  - ci/cd
  - docker
ogImage: ./docker-github.png
---

I use Github actions in combination with Opentofu and private Github Container registry images to maintain my private server infrastructure.
While building and pushing the image was not an issue, pulling the images on the remote host using the GITHUB_TOKEN provided in actions was hard.
It took me way too long to figure this out, so this is a short write up for others who might struggle.

---

I have a personal server to somewhere in the cloud with limited compute, RAM and stroage space for hosting all my small side projects I hope noone will find except me.
The server costs me 5€ a month and is a single node docker swarm cluster to which I can deploy using Opentofu.
It is secured using mutual TLS and hosts different other services all intended to give me the possibility too self-host as much as I want.

The issue I faced now was that for the first I wanted to customiza a docker image and host it on the Github Conatiner Registry privately (just in case).
And while building an pushuing the images using Github actions was not as easy as I thought it was possible after three tries.
But pulling the images using Opentofu configuration and the supplied GITHUB_TOKEN in actions felt impossible.
I tried each and every configuration I could imageine from the [`kreuzwerker/docker`](https://search.opentofu.org/provider/kreuzwerker/docker/latest) provider until I finally found my solution.
The solution had me scrambling together everything I knew about [`docker login`](https://docs.docker.com/reference/cli/docker/login/), just to be provided with the most obvious configuration imaginable.

The Opentofu configuration contains the registry auth configuration for `ghcr.io` and a link to the defualt file location of the docker configuration.
Within this configuration resides a token for each registry you are currently logged in to.
So the only step remaing was authenticating into the `ghcr.io` registry before applying the Opentofu configuration.
To do this you can simply use the [`docker/login-action`](https://github.com/marketplace/actions/docker-login).

```hcl
provider "docker" {
  host          = # your host
  #...

  registry_auth {
    address     = "ghcr.io"
    config_file = pathexpand("~/.docker/config.json")
  }
}
```

The Container registry must be specified by name.
The username will be replaced by the actor who triggered the current execution.
The token is specific to this execution.
Do not forget to add `packages: read` when pulling the images as permission.

```yaml
- name: Log in to the Container registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ '{{ github.actor }}' }}
          password: ${{ '{{ secrets.GITHUB_TOKEN }}' }}
```

I hope this short write up helped, as it would have helped me. And maybe it will help me in the future again.
