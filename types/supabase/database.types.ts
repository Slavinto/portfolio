import { OrderStatus } from "@/lib/nowpayments/schemas";
import { PersistedMove, PersistedState } from "../games/chess";
import { NowPaymentsStatus } from "../nowpayments/types";

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type GameTableData = Tables<"games">;
export type MoveTableData = Tables<"moves">;
export type Order = Tables<"orders">;
export type Payment = Tables<"payments">;
export type PaymentEvent = Tables<"payment_events">;

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "13.0.4";
    };
    graphql_public: {
        Tables: {
            [_ in never]: never;
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            graphql: {
                Args: {
                    extensions?: Json;
                    operationName?: string;
                    query?: string;
                    variables?: Json;
                };
                Returns: Json;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
    public: {
        Tables: {
            chess_messages: {
                Row: {
                    created_at: string | null;
                    game_id: string;
                    id: number;
                    message: string;
                    sender: string;
                };
                Insert: {
                    created_at?: string | null;
                    game_id: string;
                    id?: never;
                    message: string;
                    sender: string;
                };
                Update: {
                    created_at?: string | null;
                    game_id?: string;
                    id?: never;
                    message?: string;
                    sender?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "chess_messages_game_id_fkey";
                        columns: ["game_id"];
                        isOneToOne: false;
                        referencedRelation: "games";
                        referencedColumns: ["id"];
                    }
                ];
            };
            games: {
                Row: {
                    created_at: string;
                    creator_id: string | null;
                    id: string;
                    player_black: string | null;
                    player_white: string | null;
                    state_json: PersistedState;
                    status: string;
                    turn: string;
                    updated_at: string;
                    winner: string | null;
                };
                Insert: {
                    created_at?: string;
                    creator_id?: string | null;
                    id?: string;
                    player_black?: string | null;
                    player_white?: string | null;
                    state_json: PersistedState;
                    status?: string;
                    turn?: string;
                    updated_at?: string;
                    winner?: string | null;
                };
                Update: {
                    created_at?: string;
                    creator_id?: string | null;
                    id?: string;
                    player_black?: string | null;
                    player_white?: string | null;
                    state_json?: PersistedState;
                    status?: string;
                    turn?: string;
                    updated_at?: string;
                    winner?: string | null;
                };
                Relationships: [];
            };
            moves: {
                Row: {
                    created_at: string;
                    game_id: string;
                    id: number;
                    move_json: PersistedMove;
                    move_number: number;
                    player_id: string;
                };
                Insert: {
                    created_at?: string;
                    game_id: string;
                    id?: number;
                    move_json: PersistedMove;
                    move_number: number;
                    player_id: string;
                };
                Update: {
                    created_at?: string;
                    game_id?: string;
                    id?: number;
                    move_json?: PersistedMove;
                    move_number?: number;
                    player_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "moves_game_id_fkey";
                        columns: ["game_id"];
                        isOneToOne: false;
                        referencedRelation: "games";
                        referencedColumns: ["id"];
                    }
                ];
            };
            offers: {
                Row: {
                    created_at: string | null;
                    expires_at: string | null;
                    from_player: string;
                    game_id: string | null;
                    id: string;
                    status: string | null;
                    to_player: string;
                    type: string;
                };
                Insert: {
                    created_at?: string | null;
                    expires_at?: string | null;
                    from_player: string;
                    game_id?: string | null;
                    id?: string;
                    status?: string | null;
                    to_player: string;
                    type: string;
                };
                Update: {
                    created_at?: string | null;
                    expires_at?: string | null;
                    from_player?: string;
                    game_id?: string | null;
                    id?: string;
                    status?: string | null;
                    to_player?: string;
                    type?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "offers_game_id_fkey";
                        columns: ["game_id"];
                        isOneToOne: false;
                        referencedRelation: "games";
                        referencedColumns: ["id"];
                    }
                ];
            };
            orders: {
                Row: {
                    amount_usd: number;
                    created_at: string;
                    currency: string;
                    id: string;
                    status: OrderStatus;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    amount_usd: number;
                    created_at?: string;
                    currency?: string;
                    id?: string;
                    status?: OrderStatus;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    amount_usd?: number;
                    created_at?: string;
                    currency?: string;
                    id?: string;
                    status?: OrderStatus;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            payment_events: {
                Row: {
                    event_hash: string;
                    id: number;
                    payment_id: string;
                    received_at: string;
                    status: string;
                };
                Insert: {
                    event_hash: string;
                    id?: number;
                    payment_id: string;
                    received_at?: string;
                    status: string;
                };
                Update: {
                    event_hash?: string;
                    id?: number;
                    payment_id?: string;
                    received_at?: string;
                    status?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "fk_payment";
                        columns: ["payment_id"];
                        isOneToOne: false;
                        referencedRelation: "payments";
                        referencedColumns: ["payment_id"];
                    }
                ];
            };
            payments: {
                Row: {
                    created_at: string;
                    order_id: string;
                    pay_amount: number | null;
                    pay_currency: string | null;
                    payment_id: string;
                    price_amount: number;
                    price_currency: string;
                    provider: string;
                    status: NowPaymentsStatus;
                    updated_at: string;
                };
                Insert: {
                    created_at?: string;
                    order_id: string;
                    pay_amount?: number | null;
                    pay_currency?: string | null;
                    payment_id: string;
                    price_amount: number;
                    price_currency: string;
                    provider?: string;
                    status: NowPaymentsStatus;
                    updated_at?: string;
                };
                Update: {
                    created_at?: string;
                    order_id?: string;
                    pay_amount?: number | null;
                    pay_currency?: string | null;
                    payment_id?: string;
                    price_amount?: number;
                    price_currency?: string;
                    provider?: string;
                    status?: NowPaymentsStatus;
                    updated_at?: string;
                };
                Relationships: [];
            };
            players: {
                Row: {
                    avatar_url: string | null;
                    bio: string | null;
                    created_at: string | null;
                    draws: number | null;
                    id: string;
                    losses: number | null;
                    rating: number | null;
                    updated_at: string | null;
                    username: string | null;
                    wins: number | null;
                };
                Insert: {
                    avatar_url?: string | null;
                    bio?: string | null;
                    created_at?: string | null;
                    draws?: number | null;
                    id: string;
                    losses?: number | null;
                    rating?: number | null;
                    updated_at?: string | null;
                    username?: string | null;
                    wins?: number | null;
                };
                Update: {
                    avatar_url?: string | null;
                    bio?: string | null;
                    created_at?: string | null;
                    draws?: number | null;
                    id?: string;
                    losses?: number | null;
                    rating?: number | null;
                    updated_at?: string | null;
                    username?: string | null;
                    wins?: number | null;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            increment_player_stats: {
                Args: { p_player_id: string; p_result: string };
                Returns: undefined;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
    keyof Database,
    "public"
>];

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
              DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never = never
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
          DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
          DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
          Row: infer R;
      }
        ? R
        : never
    : never;

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
          Insert: infer I;
      }
        ? I
        : never
    : never;

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never = never
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
          Update: infer U;
      }
        ? U
        : never
    : never;

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema["Enums"]
        | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never = never
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {},
    },
} as const;
