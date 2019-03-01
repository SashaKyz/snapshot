# frozen_string_literal: true

# query builder helper
module QueryBuilderHelper
  NUMBER_OF_FRAGMENTS = '10'
  NO_BOOST = '1'
  LOW_BOOST = '2'
  MEDIUM_BOOST = '4'
  HIGH_BOOST = '10'
  SIZE = '10'
  TRACK_SCORES = 'true'
  REQUIRE_FIELD_MATCH = 'false'

  def formatted_date_of_birth(string)
    return if string.nil?
    date = DateTime.parse(string)
    formatted_date = date.strftime('%m-%d-%Y')
    formatted_date.to_s.downcase
                  .gsub(%r{[-/]*(\d+)[-/]*}, '\1')
                  .gsub(/[_%]/, '_' => '?', '%' => '*')
  end

  def formatted_query(string)
    string.to_s.downcase
          .gsub(%r{[-/]*(\d+)[-/]*}, '\1')
          .gsub(/[_%]/, '_' => '?', '%' => '*')
  end

  def match_query(field, query, operator: nil, boost: nil)
    return if query.blank?

    { match: {
      field => {
        query: query, operator: operator, boost: boost
      }.delete_if { |_k, v| v.blank? }
    } }
  end

  def query_string(field, query, boost: nil)
    return if query.blank?

    {
      query_string:
      {
        default_field: field,
        query: query,
        boost: boost
      }
    }
  end
end
