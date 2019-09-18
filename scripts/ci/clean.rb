#!/usr/bin/env ruby
# frozen_string_literal: true

project_name = "intake_accelerator#{ENV['BUILD_NUMBER']}"
release_args = "-p #{project_name} -f docker/release/docker-compose.yml"
test_args = "-p #{project_name}_test -f docker/test/docker-compose.yml"
bubble_args = '-f acceptance_testing/bubble/docker-compose.bubble.yml'

if ENV['GIT_BRANCH'] == 'origin/master'
  puts '==> Tearing down the bubble'
  `docker-compose #{bubble_args} down`
  `rm -rf integrated-test-environment`

  puts '==> Removing release artifacts'
  `rm -rf release`
  `docker-compose #{release_args} down --volumes --remove-orphans --rmi all`
end

puts '==> Removing test artifacts'
`docker-compose #{test_args} down --volumes --remove-orphans --rmi all`

puts '==> Removing generated images'
docker_images = `docker images -q -f label=application=intake_accelerator`.tr("\n", ' ')
`docker rmi #{docker_images} -f` unless docker_images.empty?
