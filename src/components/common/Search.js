import { TextField, Stack, Autocomplete, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { API } from '../../lib/api';
import { SearchOutlined } from '@mui/icons-material';

export default function Search() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  /* eslint-disable-next-line */
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    API.GET(API.ENDPOINTS.search(query)).then(({ data }) => {
      if (query) {
        setIsOpen(true);
        setPosts(data);
      }
    });
  }, [query]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    const clearup = () => {
      setIsOpen(false);
      setQuery('');
      setPosts([]);
    };

    return clearup;
  }, []);

  return (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <SearchOutlined sx={{ mr: 1 }} />
        <Autocomplete
          id='free-solo-demo'
          freeSolo
          getOptionLabel={(option) => option.topic}
          options={posts?.map((option) => option)}
          onChange={(event, option) => {
            window.location.href = `/posts/${option._id}`;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Search'
              onChange={handleChange}
              sx={{ minWidth: 300 }}
            />
          )}
        />
      </Box>
    </Stack>
  );
}
