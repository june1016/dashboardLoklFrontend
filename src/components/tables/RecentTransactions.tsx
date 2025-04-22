import { 
    Box, 
    List, 
    ListItem, 
    ListItemAvatar, 
    Avatar, 
    ListItemText, 
    Typography, 
    Divider, 
    useTheme 
  } from '@mui/material';
  
  export default function RecentTransactions() {
    const theme = useTheme();
  
    const transactions = [
      {
        name: 'Olivia Martin',
        email: 'olivia.martin@email.com',
        amount: '+$1,999.00',
        color: theme.palette.primary.main,
      },
      {
        name: 'Jackson Lee',
        email: 'jackson.lee@email.com',
        amount: '+$1,499.00',
        color: theme.palette.info.main,
      },
      {
        name: 'Isabella Nguyen',
        email: 'isabella.nguyen@email.com',
        amount: '+$1,299.00',
        color: theme.palette.secondary.main,
      },
      {
        name: 'William Kim',
        email: 'will@email.com',
        amount: '+$99.00',
        color: theme.palette.success.main,
      },
      {
        name: 'Sofia Davis',
        email: 'sofia.davis@email.com',
        amount: '+$450.00',
        color: theme.palette.warning.main,
      },
    ];
  
    return (
      <List sx={{ width: '100%', py: 0 }}>
        {transactions.map((transaction, index) => (
          <Box key={index}>
            <ListItem 
              alignItems="center" 
              sx={{ 
                py: 1.5,
                px: 0
              }}
            >
              <ListItemAvatar>
                <Avatar 
                  sx={{ 
                    bgcolor: transaction.color,
                    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                  }}
                >
                  {transaction.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={500}>
                    {transaction.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {transaction.email}
                  </Typography>
                }
              />
              <Typography 
                variant="subtitle2" 
                fontWeight={600} 
                color="primary"
              >
                {transaction.amount}
              </Typography>
            </ListItem>
            {index < transactions.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </Box>
        ))}
      </List>
    );
  }