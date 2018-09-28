# frozen_string_literal: true

require 'rails_helper'

describe ApiController do
  controller do
    def custom
      FerbAPI.make_api_call(
        security_token: 'my_security_token',
        request_id: 'my_request_id',
        url: '/some_test_path',
        method: :get
      )
    end
  end

  before do
    routes.draw { get 'custom' => 'api#custom' }
  end

  it "renders a JSON error if there's a timeout" do
    stub_request(:get, %r{/some_test_path}).to_timeout
    process :custom, method: :get
    expect(JSON.parse(response.body)).to match a_hash_including(
      'error' => 'api_error',
      'status' => 500,
      'message' => 'execution expired',
      'api_response_body' => {
        'issue_details' => [{
          'incident_id' => anything,
          'status' => 500,
          'type' => 'api_error',
          'response_body' => 'Internal Server Error'
        }]
      },
      'method' => 'get',
      'url' => '/some_test_path'
    )
  end

  it "renders a JSON error if there's an error on the api, appends extra api info" do
    stub_request(:get, %r{/some_test_path})
      .and_return(
        body: 'this is not json',
        status: 500,
        headers: { 'Content-Type' => 'application/json' }
      )
    process :custom, method: :get
    expect(JSON.parse(response.body)).to match a_hash_including(
      'error' => 'api_error',
      'status' => 500,
      'message' => 'Error while calling /some_test_path',
      'api_response_body' => {
        'issue_details' => [{
          'incident_id' => anything,
          'status' => anything,
          'type' => 'api_error',
          'response_body' => 'this is not json'
        }]
      },
      'method' => 'get',
      'url' => '/some_test_path'
    )
    expect(response.status).to eq 500
  end

  it 'responds with error status code' do
    stub_request(:get, %r{/some_test_path})
      .and_return(status: 403)
    process :custom, method: :get
    expect(response.status).to eq 403
  end
end
