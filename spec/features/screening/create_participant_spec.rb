# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

feature 'Edit Screening' do
  scenario 'adding a new participant' do
    existing_screening = {
      id: 4,
      created_at: '2016-10-24T15:14:22.923Z',
      ended_at: nil,
      incident_county: nil,
      incident_date: nil,
      location_type: nil,
      communication_method: nil,
      name: nil,
      report_narrative: nil,
      reference: '8KXNCK',
      response_time: nil,
      screening_decision: nil,
      started_at: nil,
      address: {
        street_address: nil,
        state: nil,
        city: nil,
        zip: nil,
        id: 8
      },
      participants: []
    }.with_indifferent_access

    faraday_stub = Faraday.new do |builder|
      builder.adapter :test do |stub|
        stub.get("/api/v1/screenings/#{existing_screening[:id]}") do |_|
          [200, {}, existing_screening]
        end
      end
    end
    allow(API).to receive(:connection).and_return(faraday_stub)

    marge = Participant.new(id: 99, first_name: 'Marge', last_name: 'Simpson')
    allow(PeopleRepo).to receive(:search).with(marge.first_name).and_return([marge])

    visit edit_screening_path(id: existing_screening[:id])

    within '#participants-card' do
      fill_in_autocompleter 'Participants', with: 'Marge'
      find('li', text: 'Marge Simpson').click
    end

    within '#participants-card' do
      expect(page).to have_content 'Marge Simpson'
    end
  end
end
