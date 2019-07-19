# frozen_string_literal: true

require 'rails_helper'

describe RelationshipsRepository do
  let(:token) { 'my_token' }
  let(:request_id) { 'my_request_id' }
  let(:empty_response) do
    double(:response, body: [], status: 200, headers: {})
  end

  context 'in snapshot' do
    describe '.search' do
      let(:relationships) do
        [{
          id: 'EwsPYbG07n',
          first_name: 'berry',
          last_name: 'Badger',
          relationship_to: [{
            related_person_first_name: 'amy',
            related_person_last_name: 'Brownbridge',
            relationship_context: '',
            related_person_relationship: '300',
            indexed_person_relationship: '300',
            legacy_descriptor: { legacy_id: 'EwsPYbG07n' }
          }],
          legacy_descriptor: { legacy_id: 'EwsPYbG07n' }
        }, {
          id: 'ABCDEFGHIJ',
          relationship_to: [],
          legacy_descriptor: { legacy_id: 'ABCDEFGHIJ' }
        }, {
          id: 'ZYXWVUTSRQ',
          first_name: 'Jon',
          last_name: 'Snow',
          relationship_to: [{
            related_person_first_name: 'Arya',
            related_person_last_name: 'Stark',
            relationship_context: '',
            related_person_relationship: '280',
            indexed_person_relationship: '280',
            legacy_descriptor: { legacy_id: 'ZYXWVUTSRQ' }
          }],
          legacy_descriptor: { legacy_id: 'ZYXWVUTSRQ' }
        }]
      end

      let(:single_response) do
        double(:response, body: [relationships.first])
      end

      let(:full_response) do
        double(:response, body: relationships)
      end

      it 'should return an empty list when no relationships found' do
        relationships = described_class.search(token, request_id, [])

        expect(relationships).to eq([])
      end

      it 'should return all relationships found for a single id' do
        expect(FerbAPI).to receive(:make_api_call)
          .with(
            token: token,
            request_id: request_id,
            url: '/clients/relationships',
            method: :get,
            payload: { clientIds: ['EwsPYbG07n'] }
          ).and_return(single_response)

        relationships = described_class.search(token, request_id, ['EwsPYbG07n'])

        expect(relationships).to eq([relationships.first])
      end

      it 'should return all relationships for multiple clients' do
        expect(FerbAPI).to receive(:make_api_call)
          .with(
            token: token,
            request_id: request_id,
            url: '/clients/relationships',
            method: :get,
            payload: { clientIds: %w[EwsPYbG07n ABCDEFGHIJ ZYXWVUTSRQ] }
          ).and_return(full_response)

        relationships = described_class.search(
          token,
          request_id,
          %w[EwsPYbG07n ABCDEFGHIJ ZYXWVUTSRQ]
        )

        expect(relationships).to eq(relationships)
      end
    end
  end

  context 'in screening' do
    describe '.get_relationships_for_screening_id' do
      let(:screening_relationships) do
        [
          {
            id: '1',
            date_of_birth: '1958-11-11',
            age: '59',
            age_unit: 'Y',
            first_name: 'New York',
            middle_name: 'C',
            last_name: 'Pechan',
            name_suffix: 'Sr.',
            gender: 'M',
            relationship_to: [
              {
                relationship_id: 123,
                related_person_id: 2,
                related_person_first_name: 'North-Carolina',
                related_person_middle_name: 'B',
                related_person_last_name: 'Walburn',
                related_person_name_suffix: 'Jr. ',
                related_person_gender: 'M',
                related_person_date_of_birth: '1997-02-02'
              }
            ], candidate_to: [
              {
                candidate_id: 7,
                candidate_first_name: 'Jim',
                candidate_middle_name: '',
                candidate_last_name: 'Dowles',
                candidate_name_suffix: 'Mr',
                candidate_gender: 'M',
                candidate_date_of_birth: '1988-11-11',
                candidate_age: 20,
                candidate_age_unit: 'Y'
              }
            ]
          }
        ].to_json
      end

      let(:screening_response) do
        double(:response, body: screening_relationships)
      end

      it 'should return an empty list when no relationships found' do
        relationships = described_class.get_relationships_for_screening_id(
          token,
          request_id,
          nil
        )

        expect(relationships).to eq([])
      end

      it 'should return all relationships for a screening' do
        expect(FerbAPI).to receive(:make_api_call)
          .with(
            token: token,
            request_id: request_id,
            url: '/screenings/1/relationships_with_candidates',
            method: :get
          ).and_return(screening_response)

        relationships = described_class.get_relationships_for_screening_id(
          token,
          request_id,
          '1'
        )

        expect(relationships).to eq(screening_relationships)
      end
    end
  end
end
