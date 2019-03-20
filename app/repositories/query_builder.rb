# frozen_string_literal: true

# class for dora search
class QueryBuilder < BaseQueryBuilder
  def self.build_base(builder)
    if builder.client_id_searched?
      builder.extend(PersonSearchByClientId).build_query(builder)
    elsif builder.ssn_searched?
      builder.extend(PersonSearchSsnQueryBuilder).build_query(builder)
    elsif builder.advanced_search_on?
      build_advanced_search(builder)
    else
      builder.extend(PersonSearchQueryBuilder).build_query(builder)
    end
  end

  def self.build_advanced_search(builder)
    builder.extend(PersonSearchNameQueryBuilder).build_query(builder)
    builder.extend(PersonSearchByDateOfBirthQueryBuilder).build_query(builder)
    builder.extend(PersonSearchBySexAtBirth).build_query(builder)
  end
end
