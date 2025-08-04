// src/providers/AppProviders.js
import { AgentsProvider } from '../context/agentsContext';
import { AuthProvider } from '../context/authContext';
import { LoadingProvider } from '../providers/loadingProvider';
import { SettingsProvider } from '../context/settingsContext';
import { StatsProvider } from '../context/statsContext';
import { DoneTicketsProvider } from '../context/doneTicketsContext';
import { TicketsProvider } from '../context/ticketsContext';
import { DailyStatsProvider } from '../context/dailyStatsContext';
import { SignalRProvider } from '../context/signalRContext';
import { NotificationProvider } from '../context/notificationsContext';
import { FiltersProvider } from '../context/filterContext';
import { ProfilePhotoProvider } from '../context/profilePhotoContext';
import { SidebarProvider } from '../context/sidebarContext';


export default function AppProviders({ children }) {
  return (
    <AgentsProvider>
      <AuthProvider>
        <LoadingProvider>
          <SettingsProvider>
            <StatsProvider>
              <DoneTicketsProvider>
                <TicketsProvider>
                  <DailyStatsProvider>
                    <SignalRProvider>
                      <NotificationProvider>
                        <FiltersProvider>
                          <ProfilePhotoProvider>
                            <SidebarProvider>
                              {children}
                            </SidebarProvider>
                          </ProfilePhotoProvider>
                        </FiltersProvider>
                      </NotificationProvider>
                    </SignalRProvider>
                  </DailyStatsProvider>
                </TicketsProvider>
              </DoneTicketsProvider>
            </StatsProvider>
          </SettingsProvider>
        </LoadingProvider>
      </AuthProvider>
    </AgentsProvider>
  );
}
