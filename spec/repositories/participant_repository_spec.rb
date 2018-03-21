# frozen_string_literal: true

require 'rails_helper'

describe ParticipantRepository do
  let(:security_token) { 'my_security_token' }

  describe '.create' do
    let(:participant_id) { '11' }

    let(:response) do
      double(:response, body: { 'id' => participant_id, 'first_name' => 'New Participant' })
    end
    let(:screening_id) { '1' }

    describe 'when creating a person with no legacy_id' do
      let(:participant) do
        Participant.new(
          id: nil,
          first_name: 'New Participant',
          screening_id: screening_id
        )
      end

      let(:payload) do
        {
          screening_id: screening_id,
          legacy_descriptor: {
            legacy_id: participant.legacy_descriptor&.legacy_id,
            legacy_table_name: participant.legacy_descriptor&.legacy_table_name
          }
        }.as_json
      end

      before do
        expect(FerbAPI).not_to receive(:make_api_call)
        expect(IntakeAPI).to receive(:make_api_call)
          .with(security_token, '/api/v1/screenings/1/people', :post, payload)
          .and_return(response)
      end

      it 'returns the created participant with an error flag' do
        result = described_class.create(security_token, participant)
        expect(result[:error?]).to eq(false)
        expect(result[:participant].id).to eq(participant_id)
        expect(result[:participant].first_name).to eq('New Participant')
      end
    end

    describe 'when creating a person with an existing legacy_id' do
      let(:participant) do
        Participant.new(
          id: nil,
          first_name: 'New Participant',
          screening_id: screening_id,
          legacy_descriptor: {
            legacy_id: participant_id
          }
        )
      end

      let(:payload) do
        {
          screening_id: screening_id,
          legacy_descriptor: {
            legacy_id: participant.legacy_descriptor&.legacy_id,
            legacy_table_name: participant.legacy_descriptor&.legacy_table_name
          }
        }.as_json
      end

      it 'should return a participant when authorization succeeds' do
        expect(FerbAPI).to receive(:make_api_call)
          .with(security_token, "/authorize/client/#{participant_id}", :get)
          .and_return(status: 200)
        expect(IntakeAPI).to receive(:make_api_call)
          .with(security_token, '/api/v1/screenings/1/people', :post, payload)
          .and_return(response)

        result = described_class.create(security_token, participant)
        expect(result[:error?]).to eq(false)
        expect(result[:participant].id).to eq(participant_id)
        expect(result[:participant].first_name).to eq('New Participant')
      end

      it 'should return an error when authorization fails' do
        expect(FerbAPI).to receive(:make_api_call)
          .with(security_token, "/authorize/client/#{participant_id}", :get)
          .and_return(status: 403)
        expect(IntakeAPI).not_to receive(:make_api_call)
          .with(security_token, '/api/v1/screenings/1/people', :post)

        result = described_class.create(security_token, participant)
        expect(result[:error?]).to eq(true)
        expect(result[:status]).to eq(403)
      end
    end
  end

  describe '.delete' do
    let(:participant_id) { '22' }

    it 'makes a DELETE API call to participants' do
      expect(IntakeAPI).to receive(:make_api_call)
        .with(security_token, "/api/v1/participants/#{participant_id}", :delete)
      described_class.delete(security_token, participant_id)
    end
  end

  describe '.update' do
    let(:response) do
      double(:response, body: { 'id' => participant_id, 'first_name' => 'Updated Participant' })
    end
    let(:participant) do
      double(
        :participant,
        id: participant_id,
        as_json: { 'id' => participant_id, 'first_name' => 'Updated Participant' }
      )
    end

    context 'when participant has an id' do
      let(:participant_id) { '91' }

      before do
        expect(IntakeAPI).to receive(:make_api_call)
          .with(
            security_token,
            "/api/v1/participants/#{participant_id}",
            :put,
            'first_name' => 'Updated Participant'
          )
          .and_return(response)
      end

      it 'returns the updated participant' do
        updated_participant = described_class.update(security_token, participant)
        expect(updated_participant.id).to eq(participant_id)
        expect(updated_participant.first_name).to eq('Updated Participant')
      end
    end

    context 'when participant has no id' do
      let(:participant_id) { nil }

      it 'raises an error' do
        expect do
          described_class.update(security_token, participant)
        end.to raise_error('Error updating participant: id is required')
      end
    end
  end
end
