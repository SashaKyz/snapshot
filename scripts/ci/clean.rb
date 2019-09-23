#!/usr/bin/env ruby
# frozen_string_literal: true

def cputs(cmd)
  puts "command: #{cmd}\n#{`#{cmd}`}"
end

project_name = "intake_accelerator#{ENV['BUILD_NUMBER']}"
release_args = "-p #{project_name} -f docker/release/docker-compose.yml"
test_args = "-p #{project_name}_test -f docker/test/docker-compose.yml"
bubble_args = "-p acceptance_bubble_#{ENV['BUILD_NUMBER']}\
  -f acceptance_testing/bubble/docker-compose.bubble.yml"

if ENV['GIT_BRANCH'] == 'origin/master'
  puts "Debug: current directory is: #{`pwd`}"
  puts '==> Tearing down the bubble'
  cputs "docker-compose #{bubble_args} down"
  cputs 'rm -rf acceptance_testing'

  puts '==> Removing release artifacts'
  cputs 'rm -rf release'
  cputs "docker-compose #{release_args} down --volumes --remove-orphans --rmi all"
end

puts '==> Removing test artifacts'
cputs "docker-compose #{test_args} down --volumes --remove-orphans --rmi all"

puts '==> Removing generated images'
docker_images = `docker images -q -f label=application=intake_accelerator`.tr("\n", ' ')
cputs("docker rmi #{docker_images} -f") unless docker_images.empty?
