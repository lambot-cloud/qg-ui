import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  useTheme,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Link
} from '@mui/material';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  Scatter
} from 'recharts';
import { Service } from '../types';

interface TechPattern {
  pattern: RegExp;
  normalizeVersion?: (version: string) => string;
}

interface TechVersion {
  version: string;
  count: number;
}

interface TechInfo {
  name: string;
  count: number;
  services: Set<string>;
  versions: TechVersion[];
  quadrant: string;
}

interface TechRadarProps {
  services: Array<Service>;
}

// Паттерны для нормализации названий технологий
const TECH_PATTERNS: Record<string, TechPattern> = {
  // Языки
  'net8': {
    pattern: /(?:\.net|net|dotnet)\s*(?:v?8\.0|8)/i,
    normalizeVersion: () => '8.0'
  },
  'net6': {
    pattern: /(?:\.net|net|dotnet)\s*(?:v?6\.0|6)/i,
    normalizeVersion: () => '6.0'
  },
  netcore: {
    pattern: /(?:\.net\s*core|netcore|dotnet\s*core)(?:\s*app)?[\s.]*v?(\d+(?:\.\d+)?)?|netcoreapp(\d+(?:\.\d+)?)/i,
    normalizeVersion: (v: string) => {
      const match = v.match(/(?:\.net\s*core|netcore|dotnet\s*core|netcoreapp)[\s.]*v?(\d+(?:\.\d+)?)/i);
      return match ? match[1] : v;
    }
  },
  java: {
    pattern: /\bjava(?:\s*\d+(?:\.\d+)*)?(?:\s*jdk)?/i,
    normalizeVersion: (v: string) => v.replace(/^java\s*/, '').replace(/^v/, '')
  },
  python: {
    pattern: /\bpython\s*\d*(?:\.\d+)*\b/i,
    normalizeVersion: (v: string) => v.replace(/^python\s*/, '').replace(/^v/, '')
  },
  nodejs: {
    pattern: /\b(?:node(?:\.?js?)?|nodejs)\s*v?\d*(?:\.\d+)*\b/i,
    normalizeVersion: (v: string) => {
      const version = v.replace(/^(?:node(?:\.?js?)?|nodejs)\s*v?/, '');
      return version || 'unknown';
    }
  },
  typescript: {
    pattern: /\btypescript\b|\bts\b/i,
    normalizeVersion: (v: string) => v.replace(/^typescript\s*/, '').replace(/^v/, '')
  },
  javascript: {
    pattern: /\bjavascript\b|\bjs\b/i,
    normalizeVersion: (v: string) => v.replace(/^javascript\s*/, '').replace(/^v/, '')
  },
  golang: {
    pattern: /\bgo(?:lang)?\s*\d*(?:\.\d+)*\b/i,
    normalizeVersion: (v: string) => v.replace(/^go(?:lang)?\s*/, '').replace(/^v/, '')
  }
};

// Цвета для категорий
const CATEGORY_COLORS: Record<string, string> = {
  'Языки программирования': '#93c47d',    // Зеленый
  'Другое': '#b4a7d6'        // Фиолетовый
};

const TechRadar: React.FC<TechRadarProps> = ({ services }) => {
  const theme = useTheme();
  const [selectedTech, setSelectedTech] = useState<TechInfo | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  
  const radarData = useMemo(() => {
    console.log('Processing services:', services);
    const techMap = new Map<string, TechInfo>();
    
    // Инициализируем все языки из TECH_PATTERNS
    Object.entries(TECH_PATTERNS).forEach(([key, _]) => {
      techMap.set(key, {
        name: key,
        count: 0,
        services: new Set(),
        versions: [],
        quadrant: 'Языки программирования'
      });
    });
    
    services.forEach((service: Service) => {
      const description = service.description || '';
      const serviceName = service.service_name || '';
      
      Object.entries(TECH_PATTERNS).forEach(([key, pattern]) => {
        const match = description.match(pattern.pattern);
        if (match) {
          const techInfo = techMap.get(key)!;
          techInfo.count++;
          techInfo.services.add(serviceName);
          
          const version = pattern.normalizeVersion ? 
            pattern.normalizeVersion(match[1] || '') : 
            (match[1] || 'unknown');
            
          const versionInfo = techInfo.versions.find(v => v.version === version);
          if (versionInfo) {
            versionInfo.count++;
          } else if (version) {
            techInfo.versions.push({ version, count: 1 });
          }
        }
      });
    });

    // Transform data for the radar chart - каждый язык становится сектором
    return Array.from(techMap.entries())
      .filter(([_, techInfo]) => techInfo.services.size > 0) // Фильтруем языки без сервисов
      .map(([key, techInfo], index, filteredArray) => {
        // Calculate dots positions for services in this language sector
        const dots = Array.from(techInfo.services).map((service) => {
          const baseAngle = index * (360 / filteredArray.length);
          const radius = Math.random() * 80 + 20; // Random radius between 20 and 100
          const angle = (baseAngle + (Math.random() * 60 - 30)) * Math.PI / 180; // Convert to radians
          return {
            name: service,
            value: radius,
            angle: angle,
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
            versions: techInfo.versions
          };
        });

        return {
          subject: key,
          technologies: [techInfo],
          value: techInfo.services.size,
          dots,
          color: CATEGORY_COLORS['Языки программирования']
        };
      });
  }, [services]);

  // Получаем уникальные системы для фильтра
  const systems = useMemo(() => {
    if (!selectedTech) return [];
    const systemSet = new Set<string>();
    Array.from(selectedTech.services).forEach(serviceName => {
      const service = services.find(s => s.service_name === serviceName);
      if (service?.information_system) {
        systemSet.add(service.information_system);
      }
    });
    return Array.from(systemSet).sort();
  }, [selectedTech, services]);

  // Фильтруем сервисы по выбранной системе и добавляем информацию о версии
  const filteredServices = useMemo(() => {
    if (!selectedTech) return [];
    return Array.from(selectedTech.services).filter(serviceName => {
      const service = services.find(s => s.service_name === serviceName);
      return selectedSystem === 'all' || service?.information_system === selectedSystem;
    }).map(serviceName => {
      const service = services.find(s => s.service_name === serviceName);
      const description = service?.description || '';
      let version = 'unknown';

      // Находим версию технологии для конкретного сервиса
      if (selectedTech.name in TECH_PATTERNS) {
        const pattern = TECH_PATTERNS[selectedTech.name];
        const match = description.match(pattern.pattern);
        if (match) {
          version = pattern.normalizeVersion ? 
            pattern.normalizeVersion(match[1] || '') : 
            (match[1] || 'unknown');
        }
      }

      return {
        serviceName,
        system: service?.information_system || '-',
        version,
        gitUrl: service?.git_url || ''
      };
    });
  }, [selectedTech, services, selectedSystem]);

  if (radarData.length === 0) {
    return (
      <Alert severity="info">
        Нет данных о технологиях. Проверьте, содержат ли сервисы описания с информацией о технологиях.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Языки программирования
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', minHeight: 800 }}>
            <CardContent>
              <ResponsiveContainer width="100%" height={750}>
                <RadarChart
                  data={radarData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                >
                  <PolarGrid 
                    gridType="circle"
                    stroke={theme.palette.divider}
                  />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ 
                      fill: theme.palette.text.primary, 
                      fontSize: 14
                    }}
                    axisLine={{ stroke: theme.palette.divider }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 'auto']}
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  {radarData.map(data => (
                    <React.Fragment key={data.subject}>
                      <Radar
                        name={data.subject}
                        dataKey="value"
                        stroke={data.color}
                        fill={data.color}
                        fillOpacity={0.1}
                      />
                      <Scatter
                        data={data.dots}
                        fill={data.color}
                        name={`${data.subject} Services`}
                      />
                    </React.Fragment>
                  ))}
                  <Tooltip
                    content={(props: TooltipProps<number, string>) => {
                      const { active, payload } = props;
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        if (data.name) { // Если это точка сервиса
                          return (
                            <Card sx={{ maxWidth: 300 }}>
                              <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                  {data.name}
                                </Typography>
                                {data.versions && (
                                  <Box>
                                    {data.versions.map((v: TechVersion) => (
                                      <Typography
                                        key={v.version}
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        Версия {v.version}: {v.count} сервис(ов)
                                      </Typography>
                                    ))}
                                  </Box>
                                )}
                              </CardContent>
                            </Card>
                          );
                        } else { // Если это сектор языка
                          return (
                            <Card sx={{ maxWidth: 300 }}>
                              <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                  {data.subject}
                                </Typography>
                                <Typography variant="body2">
                                  Количество сервисов: {data.value}
                                </Typography>
                                {data.technologies[0].versions.map((v: TechVersion) => (
                                  <Typography
                                    key={v.version}
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ ml: 2 }}
                                  >
                                    Версия {v.version}: {v.count} сервис(ов)
                                  </Typography>
                                ))}
                              </CardContent>
                            </Card>
                          );
                        }
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {radarData.map(data => (
              <Card 
                key={data.subject}
                sx={{ 
                  borderLeft: `4px solid ${data.color}`,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover
                  }
                }}
                onClick={() => setSelectedTech(data.technologies[0])}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {data.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.value} сервис(ов)
                  </Typography>
                  <Stack spacing={1}>
                    {data.technologies[0].versions.map(version => (
                      <Typography
                        key={version.version}
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 2 }}
                      >
                        Версия {version.version}: {version.count} сервис(ов)
                      </Typography>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>

      <Dialog 
        open={!!selectedTech} 
        onClose={() => {
          setSelectedTech(null);
          setSelectedSystem('all');
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Сервисы использующие {selectedTech?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Система</InputLabel>
              <Select
                value={selectedSystem}
                label="Система"
                onChange={(e) => setSelectedSystem(e.target.value)}
              >
                <MenuItem value="all">Все системы</MenuItem>
                {systems.map(system => (
                  <MenuItem key={system} value={system}>
                    {system}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>System</TableCell>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Version</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.serviceName}>
                    <TableCell>{service.system}</TableCell>
                    <TableCell>
                      {service.gitUrl ? (
                        <Link
                          href={service.gitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {service.serviceName}
                        </Link>
                      ) : (
                        service.serviceName
                      )}
                    </TableCell>
                    <TableCell>{service.version}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TechRadar; 