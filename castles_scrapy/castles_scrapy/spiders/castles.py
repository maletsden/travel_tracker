import googlemaps
import scrapy

from ..items import LocationScrapyItem, RegionScrapyItem

gmaps = [googlemaps.Client(key='AIzaSyCJA8mR08RWbU5J1USHPCX0ZgLHD8xjpbk')]


class CastlesSpider(scrapy.Spider):
    name = "castles"
    start_urls = [
        'https://castles.com.ua/index.html'
    ]

    def parse(self, response):
        menu = response.css('.menu')[2:-2]

        for link in menu:
            next_link = self.start_urls[0][:-10] + link.css('::attr(href)')[0].extract()
            yield response.follow(next_link, callback=self.return_region)

    def return_region(self, response):
        yield {
            'address': self.parse_title(response.css('.menuact')),
            'locations': [location for location in self.parse_regions(response)]
        }

    def parse_regions(self, response):
        region = None
        table_rows = response.css('.csc-textpic-text table tr')[1:]
        region_rows = table_rows.css('td[colspan="5"]')

        region_rows_i = 0

        for row in table_rows:
            if (region_rows_i < len(region_rows) and
                    row.css('td:first-child')[0].extract() == region_rows[region_rows_i].extract()):
                if region:
                    yield region
                region = RegionScrapyItem()
                region['address'] = self.parse_region(region_rows[region_rows_i])
                region['locations'] = []
                region_rows_i += 1
                continue

            location = self.parse_location(row, region['address'])
            if location:
                region['locations'].append(location)

        yield region

    def parse_location(self, row, region_address):
        location = LocationScrapyItem()
        title = self.parse_title(row.css('td:nth-child(2)')[0])
        address = self.parse_title(row.css('td:nth-child(4)')[0])
        location['title'] = title
        location['address'] = address

        # Geocoding an address
        geocode_result = gmaps[0].geocode(region_address + ', ' + address)

        if not geocode_result:
            geocode_result = gmaps[0].geocode(region_address + ', ' + title)
        if not geocode_result:
            return None

        location['lanlng'] = geocode_result[0]['geometry']['location']
        return location

    def parse_title(self, title):
        return ' '.join(' '.join(title.css('::text').extract()).split())

    def parse_region(self, region):
        region = region.css('::text')[0].extract()

        if region.find('р - н') > -1:
            region = self.delete_spaces(region[:region.find('р - н')]) + ' район'
        elif region.startswith('м.'):
            region = 'м. ' + self.delete_spaces(region[2:])
        return region

    def delete_spaces(self, string):
        return ''.join(string.split())
