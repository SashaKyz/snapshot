# frozen_string_literal: true

require 'rails_helper'
require 'spec_helper'

def build_participant_from_person_attributes(person_attributes, screening_attributes)
  person_attributes.merge(
    person_id: person_attributes[:id].to_s,
    screening_id: screening_attributes[:id].to_s,
    id: nil
  )
end

feature 'Edit Screening' do
  let(:existing_screening) { FactoryGirl.create(:screening) }
  let(:marge_date_of_birth) { 15.years.ago.to_date }
  let(:marge_attributes) do
    {
      id: 99,
      date_of_birth: marge_date_of_birth.to_s(:db),
      first_name: 'Marge',
      gender: 'female',
      last_name: 'Simpson',
      ssn: '123-23-1234'
    }
  end
  let(:marge) { Person.new(marge_attributes) }

  before do
    faraday_helper do |stub|
      stub.get("/api/v1/screenings/#{existing_screening.id}") do |_|
        [200, {}, existing_screening.as_json]
      end
    end
    allow(PeopleRepo).to receive(:search).with(marge.first_name).and_return([marge])
  end

  scenario 'creating a new participant' do
    visit edit_screening_path(id: existing_screening.id)

    participant_marge = FactoryGirl.build(
      :participant,
      build_participant_from_person_attributes(marge_attributes, existing_screening)
    )
    created_participant_marge = FactoryGirl.build(
      :participant,
      participant_marge.as_json.merge(id: 23)
    )
    faraday_helper do |stub|
      stub.post('/api/v1/participants', participant_marge.to_json) do |_|
        [201, {}, created_participant_marge.as_json]
      end
    end

    within '#participants-card' do
      fill_in_autocompleter 'Participants', with: 'Marge'
      find('li', text: 'Marge Simpson').click
    end

    existing_screening.assign_attributes(participants: [created_participant_marge])
    faraday_helper do |stub|
      stub.get("/api/v1/screenings/#{existing_screening.id}") do |_|
        [200, {}, existing_screening.as_json]
      end
    end

    visit edit_screening_path(id: existing_screening.id)

    within edit_participant_card_selector(created_participant_marge[:id]) do
      within '.card-header' do
        expect(page).to have_content 'MARGE SIMPSON'
        expect(page).to have_link 'Delete participant'
      end

      within '.card-body' do
        expect(page).to have_field('First Name', with: marge.first_name)
        expect(page).to have_field('Last Name', with: marge.last_name)
        expect(page).to have_field('Gender', with: marge.gender)
        expect(page).to have_field('Date of birth', with: marge.date_of_birth)
        expect(page).to have_field('Social security number', with: marge.ssn)
        expect(page).to have_button 'Cancel'
        expect(page).to have_button 'Save'
      end
    end
  end

  scenario 'searching for a person with the participant autocompleter' do
    visit edit_screening_path(id: existing_screening.id)

    within '#participants-card' do
      fill_in_autocompleter 'Participants', with: 'Marge'
    end

    within 'li', text: 'Marge Simpson' do
      expect(page).to have_content marge_date_of_birth.strftime('%-m/%-d/%Y')
      expect(page).to have_content '15 yrs old'
      expect(page).to have_content 'Female'
    end
  end
end
