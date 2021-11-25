#!/bin/sh
# Use default Dockerfile
#docker build -t be-a-savior/server . \
# --build-arg EXPRESS_LISTEN_APP_PORT=3333 \
# --build-arg ELEPHANT_API_KEY=f534291c-65ff-4a1a-8bd1-08e66931cf36 \
# --build-arg STRIPE_SECRET_API_KEY=sk_test_51JJSD2EPk8xX8xXnUIdLybKTIGgY65u7fi74dXgrsgxgxHSNT8mlIXnC0jXayV4FsqBnTnXqDOiMSlRjcjgVLu5u00gm8iIYmY \
# --no-cache
#
# Use custom Dockerfile
docker build -t be-a-savior -f Dockerfile . \
  --build-arg EXPRESS_LISTEN_APP_PORT=3333 \
  --build-arg ELEPHANT_API_KEY=f534291c-65ff-4a1a-8bd1-08e66931cf36 \
  --build-arg STRIPE_SECRET_API_KEY=sk_test_51JJSD2EPk8xX8xXnUIdLybKTIGgY65u7fi74dXgrsgxgxHSNT8mlIXnC0jXayV4FsqBnTnXqDOiMSlRjcjgVLu5u00gm8iIYmY \
#  --no-cache

# Run and expose docker container
docker run -t -i \
  -p 3333:3333 \
  be-a-savior

