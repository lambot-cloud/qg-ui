import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  ArrowBack as ArrowBackIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { TrustedImage, GroupedTrustedImage } from '../types/trusted-images';

const extractVersion = (url: string): string => {
  const match = url.match(/:([^:]+)(?:-trusted)?$/);
  return match ? match[1] : '';
};

const extractRegistry = (url: string): string => {
  const parts = url.split('/');
  return parts[0];
};

export const TrustedImages: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<TrustedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await apiService.getTrustedImages();
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch trusted images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const groupedImages = useMemo(() => {
    const filteredImages = searchQuery
      ? images.filter(img => 
          img.image_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.image_url.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : images;

    const grouped = filteredImages.reduce((acc: GroupedTrustedImage[], img: TrustedImage) => {
      const existing = acc.find((g: GroupedTrustedImage) => g.image_name === img.image_name);
      if (existing) {
        existing.images.push(img);
      } else {
        acc.push({
          image_name: img.image_name,
          images: [img]
        });
      }
      return acc;
    }, []);

    return grouped.sort((a: GroupedTrustedImage, b: GroupedTrustedImage) => 
      a.image_name.localeCompare(b.image_name)
    );
  }, [images, searchQuery]);

  const stats = useMemo(() => {
    const trusted = images.filter(img => img.image_status === 'trusted').length;
    const deprecated = images.filter(img => img.image_status === 'depricated').length;
    return { trusted, deprecated };
  }, [images]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back to Systems
        </Button>
      </Box>

      <Box mb={3}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Typography variant="h6">Trusted Images</Typography>
          <Chip 
            label={`Trusted: ${stats.trusted}`} 
            color="success" 
            size="small" 
            sx={{ ml: 1 }} 
          />
          <Chip 
            label={`Deprecated: ${stats.deprecated}`} 
            color="error" 
            size="small" 
            sx={{ ml: 1 }} 
          />
        </Stack>
        <TextField
          fullWidth
          placeholder="Search images..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {groupedImages.map((group: GroupedTrustedImage) => {
        const trustedImages = group.images.filter(img => img.image_status === 'trusted');
        const deprecatedImages = group.images.filter(img => img.image_status === 'depricated');

        return (
          <Card key={group.image_name} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {group.image_name}
              </Typography>
              
              {trustedImages.length > 0 && (
                <Box mb={3}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <Typography variant="subtitle1" color="success.main">
                      Trusted Images
                    </Typography>
                    <Chip 
                      label={trustedImages.length} 
                      color="success" 
                      size="small" 
                    />
                  </Stack>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Registry</TableCell>
                          <TableCell>Version</TableCell>
                          <TableCell>Full URL</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {trustedImages.map((img: TrustedImage, index: number) => (
                          <TableRow key={`trusted-${index}`}>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {extractRegistry(img.image_url)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {extractVersion(img.image_url)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {img.image_url}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label="trusted"
                                color="success"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title={copiedUrl === img.image_url ? "Copied!" : "Copy URL"}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleCopyUrl(img.image_url)}
                                  color={copiedUrl === img.image_url ? "success" : "default"}
                                >
                                  {copiedUrl === img.image_url ? <CheckIcon /> : <CopyIcon />}
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {deprecatedImages.length > 0 && (
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <Typography variant="subtitle1" color="error.main">
                      Deprecated Images
                    </Typography>
                    <Chip 
                      label={deprecatedImages.length} 
                      color="error" 
                      size="small" 
                    />
                  </Stack>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Registry</TableCell>
                          <TableCell>Version</TableCell>
                          <TableCell>Full URL</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {deprecatedImages.map((img: TrustedImage, index: number) => (
                          <TableRow key={`deprecated-${index}`}>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {extractRegistry(img.image_url)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {extractVersion(img.image_url)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {img.image_url}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label="deprecated"
                                color="error"
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title={copiedUrl === img.image_url ? "Copied!" : "Copy URL"}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleCopyUrl(img.image_url)}
                                  color={copiedUrl === img.image_url ? "success" : "default"}
                                >
                                  {copiedUrl === img.image_url ? <CheckIcon /> : <CopyIcon />}
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}

      <Snackbar
        open={!!copiedUrl}
        autoHideDuration={2000}
        onClose={() => setCopiedUrl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          URL copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TrustedImages; 