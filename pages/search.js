import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'
import { Flex, Box, Text, Icon } from '@chakra-ui/react';
import { BsFilter } from 'react-icons/bs';

import Property from '../components/Property';
import SearchFilters from '../components/SearchFilters';
import { baseUrl, fetchApi } from '../utils/fetchApi';
import noresult from '../assets/images/noresult.svg'

const Search = ({ properties} ) => {
  const [searchFilters, setSearchFilters] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const alanBtn = require('@alan-ai/alan-sdk-web');
    const url=window.location.href;
    let domain = (new URL(url));
    domain = domain.hostname;
    alanBtn({
      key: '97b0f21dad7b2b6bdc3f91693a5eda5c2e956eca572e1d8b807a3e2338fdd0dc/stage',
      rootEl: document.getElementById("alan-btn"),
      onCommand:({command,filter,status,ptype,roomnum,bathnum,maxarea,minp,maxp})=>{
        if(command==='rent'){
            window.open("/search?purpose=for-rent","_self");
          
        }
        if(command==='sale'){
          window.open("/search?purpose=for-sale","_self");
        
      }
      if(command==='search'){
        window.open("/search","_self");
      }
      if(command==='home'){
        window.open("/","_self");
      
      }
      if(command==='sort'){
        if(filter==="lowest price"){
          var newUrl = (new URL(url));
          newUrl.searchParams.set('sort', "price-asc");
          window.open(newUrl,"_self"); 
        }
        if(filter==="highest price"){
          var newUrl = (new URL(url));
          newUrl.searchParams.set('sort', "price-desc");
          window.open(newUrl,"_self"); 
        }
        if(filter==="newest"){
          var newUrl = (new URL(url));
          newUrl.searchParams.set('sort', "date-asc");
          window.open(newUrl,"_self"); 
        }
        if(filter==="oldest"){
          var newUrl = (new URL(url));
          newUrl.searchParams.set('sort', "date-desc");
          window.open(newUrl,"_self");

        }
      
      }
      if(command==='rent frequency'){
        var newUrl = (new URL(url));
        newUrl.searchParams.set('rentFrequency', status);
        window.open(newUrl,"_self"); 
       
      }
      if(command==='property type'){
        var newUrl = (new URL(url));
        switch(ptype) {
          case "apartment":
            newUrl.searchParams.set('categoryExternalID', 4);
            window.open(newUrl,"_self"); 
            break;
          case "townhouse":
            newUrl.searchParams.set('categoryExternalID',16);
            window.open(newUrl,"_self");
            break;
          case "villas":
              newUrl.searchParams.set('categoryExternalID',3);
              window.open(newUrl,"_self");
              break;
          case "penthouses":
              newUrl.searchParams.set('categoryExternalID',18);
              window.open(newUrl,"_self");
              break;
          case "hotel apartments":
                newUrl.searchParams.set('categoryExternalID',21);
                window.open(newUrl,"_self");
                break;
          case "villa compund":
                newUrl.searchParams.set('categoryExternalID',19);
                indow.open(newUrl,"_self");
                break;
          case "plot":
                  newUrl.searchParams.set('categoryExternalID',14);
                  window.open(newUrl,"_self");
                  break;
          case "floor":
                newUrl.searchParams.set('categoryExternalID',12);
                window.open(newUrl,"_self");
                break;
          case "building":
                newUrl.searchParams.set('categoryExternalID',17);
                window.open(newUrl,"_self");
                break;
          default:
              window.open(newUrl,"_self");
        }
      }
      if(command==='rooms'){
        var newUrl = (new URL(url));
        newUrl.searchParams.set('roomsMin', roomnum);
        window.open(newUrl,"_self"); 
      }
      if(command==='baths'){
        var newUrl = (new URL(url));
        newUrl.searchParams.set('bathsMin', bathnum);
        window.open(newUrl,"_self"); 
      }
      if(command==='area'){
        var newUrl = (new URL(url));
        newUrl.searchParams.set('areaMax', maxarea);
        window.open(newUrl,"_self"); 
      }
      if(command==='minprice'){
        var newUrl = (new URL(url));
        newUrl.searchParams.set('minPrice', minp);
        window.open(newUrl,"_self"); 
      }
      if(command==='maxprice'){
        var newUrl = (new URL(url));
        newUrl.searchParams.set('maxPrice', maxp);
        window.open(newUrl,"_self"); 
      }

      
      
      
      }
    });
  }, []);
  

  return (
    <Box>
      <Flex
        onClick={() => setSearchFilters(!searchFilters)}
        cursor='pointer'
        bg='gray.100'
        borderBottom='1px'
        borderColor='gray.200'
        p='2'
        fontWeight='black'
        fontSize='lg'
        justifyContent='center'
        alignItems='center'
      >
        <Text>Search Property By Filters</Text>
        <Icon paddingLeft='2' w='7' as={BsFilter} />
      </Flex>
      {searchFilters && <SearchFilters />}
      <Text fontSize='2xl' p='4' fontWeight='bold'>
        Properties {router.query.purpose}
      </Text>
      <Flex flexWrap='wrap'>
        {properties.map((property) => <Property property={property} key={property.id} />)}
      </Flex>
      {properties.length === 0 && (
        <Flex justifyContent='center' alignItems='center' flexDir='column' marginTop='5' marginBottom='5'>
          <Image src={noresult} />
          <Text fontSize='xl' marginTop='3'>No Result Found.</Text>
        </Flex>
      )}
    </Box>
  );
};

export async function getServerSideProps({ query }) {
  const purpose = query.purpose || 'for-rent';
  const rentFrequency = query.rentFrequency || 'yearly';
  const minPrice = query.minPrice || '0';
  const maxPrice = query.maxPrice || '1000000';
  const roomsMin = query.roomsMin || '0';
  const bathsMin = query.bathsMin || '0';
  const sort = query.sort || 'price-desc';
  const areaMax = query.areaMax || '35000';
  const locationExternalIDs = query.locationExternalIDs || '5002';
  const categoryExternalID = query.categoryExternalID || '4';

  const data = await fetchApi(`${baseUrl}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=${purpose}&categoryExternalID=${categoryExternalID}&bathsMin=${bathsMin}&rentFrequency=${rentFrequency}&priceMin=${minPrice}&priceMax=${maxPrice}&roomsMin=${roomsMin}&sort=${sort}&areaMax=${areaMax}`);

  return {
    props: {
      properties: data?.hits,
    },
  };
}

export default Search;
