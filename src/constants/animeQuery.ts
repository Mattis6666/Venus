export default `
query ($id: Int, $page: Int, $perPage: Int, $search: String) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media (id: $id, search: $search) {
      siteUrl
      coverImage {
        extraLarge
      }
      bannerImage
      genres
      id
      title {
        romaji
        english
        native
      }
      description
      episodes
      chapters
      status
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      isAdult
      averageScore
      synonyms
      format
    }
  }
}
`;
