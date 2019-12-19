# frozen_string_literal: true

source 'https://rubygems.org'

git_source(:github) do |repo_name|
  "https://github.com/#{repo_name}.git"
end

gem 'cwds_store', github: 'ca-cwds/cwds_store'
gem 'faraday'
gem 'faraday_middleware'
gem 'feature'
gem 'haml', '~> 5.0.1'
gem 'haml-rails'
gem 'high_voltage'
gem 'lograge', '~> 0.10.0'
gem 'logstash-event', '~> 1.2.02'
gem 'logstash-logger', '~> 0.26.1'
gem 'newrelic_rpm'
gem 'nokogiri', '~> 1.10.4'
gem 'puma'
gem 'rails', '~> 5.2.2.1'
gem 'responders'
gem 'sprockets', '~>3.7.2'
gem 'system_information', github: 'ca-cwds/system_information'
gem 'virtus'
gem 'webpacker'
gem 'yard', '~> 0.9.11'

group :development, :test do
  gem 'dotenv-rails'
  gem 'factory_bot_rails', require: false
  gem 'ffaker'
  gem 'fpm',
    git: 'https://github.com/jordansissel/fpm.git',
    ref: '488863b3211572ba5488b6f3956aa365d847a48b'
  gem 'haml_lint', '0.27.0'
  gem 'i18n-tasks'
  gem 'parallel_tests', '2.28.0'
  gem 'pry'
  gem 'pry-byebug'
  gem 'pry-doc'
  gem 'pry-rails'
  gem 'pry-remote'
  gem 'pry-stack_explorer'
  gem 'pry-theme'
  gem 'rspec-rails', '~> 3.4'
  gem 'rubocop', '0.50.0'
  gem 'rubocop-junit-formatter'
  gem 'scss_lint'
end

group :development do
  gem 'license_finder'
  gem 'spring'
  gem 'web-console', '~> 3.5'
end

group :test do
  gem 'capybara', '3.6.0'
  gem 'capybara-accessible',
    git: 'https://github.com/ca-cwds/capybara-accessible.git',
    ref: 'f146be5939fca1c14a75edc066d7b1b8497f68c5'
  gem 'capybara-screenshot'
  gem 'chromedriver-helper', '1.2.0'
  gem 'faker'
  gem 'rails-controller-testing'
  gem 'rspec_junit_formatter', require: false
  gem 'selenium-webdriver', '3.11.0'
  gem 'simplecov-parallel', require: false
  gem 'webmock'
end
