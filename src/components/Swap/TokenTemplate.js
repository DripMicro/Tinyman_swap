/* eslint-disable prettier/prettier */
import { Box, Typography, MenuItem, Tooltip } from '@material-ui/core';

export default function TokenTemplate() {
  return (
    <>
      <MenuItem sx={{ typography: 'body2', py: 1, px: 2.5 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexGrow={1}>
          <Box display="flex" alignItems="center">
            <Box
              component="img"
              src="/static/token/algo.png"
              alt="Algorand's logo"
              sx={{
                mr: 2,
                width: 30,
                height: 30
              }}
            />
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle1" noWrap>
                  Algorand
                </Typography>
                <Tooltip title="Trusted asset by Pera" arrow>
                  <Box
                    component="img"
                    src="/static/token/trust.svg"
                    alt="Trust logo"
                    sx={{
                      width: 16,
                      height: 16
                    }}
                  />
                </Tooltip>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                $ALGO
              </Typography>
            </Box>
          </Box>
        </Box>
      </MenuItem>
    </>
  );
}
