// Find all our documentation at https://docs.near.org
import {
  NearBindgen,
  near,
  call,
  view,
  LookupMap,
  initialize,
} from 'near-sdk-js';
import { AccountId } from 'near-sdk-js/lib/types';

class Token {
  token_id: number;
  owner_id: AccountId;
  title: string | null;
  description: string | null;
  media: string | null;
  media_hash: string | null;
  copies: number | null;
  issued_at: number | null;
  expires_at: number | null;
  starts_at: number | null;
  updated_at: number | null;
  extra: string | null;
  reference: string | null;
  reference_hash: string | null;

  constructor(
    token_id: number,
    owner_id: AccountId,
    title?: string,
    description?: string,
    media?: string,
    media_hash?: string,
    copies?: number,
    issued_at?: number,
    expires_at?: number,
    starts_at?: number,
    updated_at?: number,
    extra?: string,
    reference?: string,
    reference_hash?: string
  ) {
    this.token_id = token_id;
    this.owner_id = owner_id.toString();
    this.title = title;
    this.description = description;
    this.media = media;
    this.media_hash = media_hash;
    this.copies = copies;
    this.issued_at = issued_at;
    this.expires_at = expires_at;
    this.starts_at = starts_at;
    this.updated_at = updated_at;
    this.extra = extra;
    this.reference = reference;
    this.reference_hash = reference_hash;
  }
}

@NearBindgen({})
class Contract {
  owner_id: AccountId;
  token_id: number;
  owner_by_id: LookupMap<string>;
  token_by_id: LookupMap<Token>;
  approved_account_ids: LookupMap<string>;

  spec: string;
  name: string;
  symbol: string;
  icon: string | null;
  base_uri: string | null;
  reference: string | null;
  reference_hash: string | null;

  constructor() {
    this.owner_id = '';
    this.token_id = 0;
    this.owner_by_id = new LookupMap('o');
    this.token_by_id = new LookupMap('t');
    this.approved_account_ids = new LookupMap('a');

    this.spec = '1.0.0';
    this.name = '';
    this.symbol = '';
    this.icon = '';
    this.base_uri = '';
    this.reference = '';
    this.reference_hash = '';
  }
  @initialize({})
  init({
    owner_id,
    name,
    symbol,
    icon,
    base_uri,
    reference,
    reference_hash,
  }: {
    owner_id: AccountId;
    name: string;
    symbol: string;
    icon?: string;
    base_uri?: string;
    reference?: string;
    reference_hash?: string;
  }) {
    this.owner_id = owner_id;
    this.token_id = 0;
    this.owner_by_id = new LookupMap('o');
    this.token_by_id = new LookupMap('t');
    this.approved_account_ids = new LookupMap('a');

    this.spec = '1.0.0';
    this.name = name;
    this.symbol = symbol;
    this.icon = icon;
    this.base_uri = base_uri;
    this.reference = reference;
    this.reference_hash = reference_hash;
  }
  @call({})
  mint_nft({ token_owner_id }) {
    this.owner_by_id.set(
      this.token_id.toString(),
      token_owner_id
    );
    let token = new Token(this.token_id, token_owner_id);

    this.token_by_id.set(this.token_id.toString(), token);

    this.token_id++;

    return token;
  }

  @view({})
  get_token_by_id({ token_id }: { token_id: number }) {
    let token =
      this.token_by_id.get(token_id.toString()) || null;

    return token;
  }
  @view({})
  get_all_tokens({
    start,
    max,
  }: {
    start?: number;
    max?: number;
  }) {
    var all_tokens = [];

    for (
      var i = start || 0;
      i <= (max || this.token_id);
      i++
    ) {
      all_tokens.push(this.token_by_id.get(i.toString()));
    }

    return all_tokens;
  }

  @call({ payableFunction: true })
  nft_approve(
    token_id: number,
    account_id: string,
    msg: string | null
  ): void | Promise<any> {
    if (!msg) {
      return null;
    }

    this.approved_account_ids.set(
      token_id.toString(),
      account_id
    );

    return this.nft_on_approve(
      token_id,
      this.owner_id,
      this.token_id,
      msg
    );
  }

  @call({ payableFunction: true })
  nft_revoke(token_id: string, account_id: string) {
    // this.approved_account_ids.set(token_id.toString(), );
  }

  @call({ payableFunction: true })
  nft_revoke_all(token_id: string) {
    return this.approved_account_ids.remove(token_id);
  }

  @view({})
  nft_is_approved(
    token_id: string,
    approved_account_id: string,
    approval_id: number | null
  ): boolean {
    let rs =
      this.token_by_id.get(token_id.toString()) || null;

    if (rs === null) {
      return false;
    }
    // Check approved_account_id existed in rs
    //code

    return true;
  }

  @call({})
  nft_on_approve(
    token_id: number,
    owner_id: string,
    approval_id: number,
    msg: string
  ) {}
}
